import { Component, EventEmitter, Output } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { CreateTaskDto } from '../../models/task.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-task-modal.html',
  styleUrl: './create-task-modal.scss',
})
export class CreateTaskModal {

  @Output() taskCreated = new EventEmitter<void>();

  taskForm: FormGroup

  minDate: string = '';

  constructor(
    private taskService: TasksService,
    private fb: FormBuilder
  ) {
    // Establecer fecha mínima como hoy
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Inicializar formulario con validadores correctos
    this.taskForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: [''], // No requerido
      prioridad: ['baja', [Validators.required]], // Requerido, valor por defecto 'baja'
      fecha_vencimiento: ['', [Validators.required]], // Requerido
      hora_especifica: ['', [Validators.required]], // Requerido por defecto (porque es_todo_el_dia es false)
      es_todo_el_dia: [false] // Por defecto false
    });

    this.taskForm.get('es_todo_el_dia')?.valueChanges.subscribe(esTodoElDia => {
      const horaControl = this.taskForm.get('hora_especifica');

      if (esTodoElDia) {
        // Si es todo el día, limpiar y deshabilitar hora específica
        horaControl?.setValue('');
        horaControl?.clearValidators();
      } else {
        // Si NO es todo el día, hora específica es requerida
        horaControl?.setValidators([Validators.required]);
      }

      horaControl?.updateValueAndValidity();
    });
  }

  get esTodoElDia(): boolean {
    return this.taskForm.get('es_todo_el_dia')?.value ?? false;
  }

  async onSubmit(): Promise<void> {
    if (this.taskForm.invalid) {
      console.error('Formulario inválido');
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;

    const horaFormateada = formValue.hora_especifica
      ? `${formValue.hora_especifica}:00`
      : undefined;

    const dto: CreateTaskDto = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion || undefined,
      prioridad: formValue.prioridad,
      fecha_vencimiento: formValue.fecha_vencimiento,
      hora_especifica: formValue.es_todo_el_dia ? undefined : formValue.hora_especifica,
      es_todo_el_dia: formValue.es_todo_el_dia
    };

    const result = await this.taskService.createTask(dto);

    if (result) {
      console.log('Tarea creada exitosamente:', result);
      this.taskCreated.emit();
      this.closeModal();
      this.resetForm();
    } else {
      console.error('Error al crear la tarea');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('create_task_modal') as HTMLDialogElement;
    this.resetForm();
    modal?.close();
  }

  // Método para resetear el formulario
  resetForm(): void {
    this.taskForm.reset({
      titulo: '',
      descripcion: '',
      prioridad: 'baja',
      fecha_vencimiento: '',
      hora_especifica: '',
      es_todo_el_dia: false
    });
  }

  showModal(): void {
    const modal = document.getElementById('create_task_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }
}
