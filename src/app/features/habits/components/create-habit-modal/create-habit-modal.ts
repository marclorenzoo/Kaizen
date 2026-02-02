import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CreateHabitDto } from '../../models/habits.model';
import { HabitsService } from '../../services/habits.service';

export interface HabitIcon {
    id: string;
    name: string;
    svg: string;
}

export type HabitFrequency = 'diaria' | 'semanal' | 'mensual';

@Component({
    selector: 'app-create-habit-modal',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './create-habit-modal.html',
    styleUrl: './create-habit-modal.scss',
})
export class CreateHabitModal {

    @Output() habitCreated = new EventEmitter<void>();
    habitForm: FormGroup;

    // Estado del modal
    selectedIcon = signal<string>('person');
    selectedColor = signal<string>('#6366F1');
    selectedFrequency = signal<HabitFrequency>('diaria');
    showAllIcons = signal<boolean>(false);
    customColor = signal<string>('#6366F1');

    constructor(
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private habitService: HabitsService
    ) {
        // ✅ IMPORTANTE: Inicializar con valores por defecto para que el formulario sea válido desde el inicio
        this.habitForm = this.fb.group({
            name: ['', [Validators.required]],
            icon: ['person', [Validators.required]],      // ✅ Valor inicial
            color: ['#6366F1', [Validators.required]],    // ✅ Valor inicial
            frequency: ['diaria', [Validators.required]], // ✅ Valor inicial
        });
    }

    // Colores predefinidos
    presetColors = [
        { id: 'indigo', value: '#6366F1' },
        { id: 'cyan', value: '#06B6D4' },
        { id: 'emerald', value: '#10B981' },
        { id: 'rose', value: '#F43F5E' },
        { id: 'orange', value: '#F97316' },
    ];

    // Iconos principales (siempre visibles)
    mainIcons: HabitIcon[] = [
        { id: 'person', name: 'Meditación', svg: '<circle cx="12" cy="8" r="5"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>' },
        { id: 'book', name: 'Lectura', svg: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>' },
        { id: 'droplet', name: 'Agua', svg: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>' },
        { id: 'dumbbell', name: 'Ejercicio', svg: '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>' },
    ];

    // Iconos extendidos (solo visibles al expandir)
    extendedIcons: HabitIcon[] = [
        { id: 'heart', name: 'Salud', svg: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>' },
        { id: 'moon', name: 'Sueño', svg: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' },
        { id: 'sun', name: 'Mañanas', svg: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' },
        { id: 'coffee', name: 'Café', svg: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>' },
        { id: 'music', name: 'Música', svg: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
        { id: 'pencil', name: 'Escritura', svg: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>' },
        { id: 'camera', name: 'Fotografía', svg: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>' },
        { id: 'bike', name: 'Ciclismo', svg: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>' },
        { id: 'apple', name: 'Nutrición', svg: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>' },
        { id: 'brain', name: 'Mente', svg: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2z"/>' },
        { id: 'wallet', name: 'Finanzas', svg: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>' },
        { id: 'phone', name: 'Digital', svg: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>' },
        { id: 'leaf', name: 'Naturaleza', svg: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>' },
        { id: 'star', name: 'Metas', svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
        { id: 'clock', name: 'Tiempo', svg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
        { id: 'target', name: 'Foco', svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
    ];

    // ✅ Seleccionar icono - ACTUALIZA SIGNAL Y FORMULARIO
    selectIcon(iconId: string): void {
        this.selectedIcon.set(iconId);
        this.habitForm.patchValue({ icon: iconId });
    }

    // ✅ Seleccionar color - ACTUALIZA SIGNAL Y FORMULARIO
    selectColor(color: string): void {
        this.selectedColor.set(color);
        this.customColor.set(color);
        this.habitForm.patchValue({ color: color });
    }

    // ✅ Cuando cambia el color picker - ACTUALIZA SIGNAL Y FORMULARIO
    onColorPickerChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.customColor.set(input.value);
        this.selectedColor.set(input.value);
        this.habitForm.patchValue({ color: input.value });
    }

    // ✅ Seleccionar frecuencia - ACTUALIZA SIGNAL Y FORMULARIO
    selectFrequency(frequency: HabitFrequency): void {
        this.selectedFrequency.set(frequency);
        this.habitForm.patchValue({ frequency: frequency });
    }

    // Toggle mostrar todos los iconos
    toggleShowAllIcons(): void {
        this.showAllIcons.update(v => !v);
    }

    // Obtener todos los iconos visibles
    get visibleIcons(): HabitIcon[] {
        return this.showAllIcons()
            ? [...this.mainIcons, ...this.extendedIcons]
            : this.mainIcons;
    }

    // Verificar si un color predefinido está seleccionado
    isPresetColorSelected(): boolean {
        return this.presetColors.some(c => c.value === this.selectedColor());
    }

    // Obtener SVG sanitizado para renderizar
    getSafeSvg(svg: string): SafeHtml {
        const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${svg}</svg>`;
        return this.sanitizer.bypassSecurityTrustHtml(fullSvg);
    }

    closeModal(): void {
        const modal = document.getElementById('create_habit_modal') as HTMLDialogElement;
        this.resetState();
        modal?.close();
    }

    showModal(): void {
        const modal = document.getElementById('create_habit_modal') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }

    resetState(): void {
        this.selectedIcon.set('person');
        this.selectedColor.set('#6366F1');
        this.selectedFrequency.set('diaria');
        this.showAllIcons.set(false);
        this.customColor.set('#6366F1');

        // ✅ Resetear el formulario con valores por defecto
        this.habitForm.reset({
            name: '',
            icon: 'person',
            color: '#6366F1',
            frequency: 'diaria'
        });
    }

    async onSubmit(): Promise<void> {
        if (this.habitForm.invalid) {
            this.habitForm.markAllAsTouched();
            return;
        }

        const habitDto: CreateHabitDto = {
            nombre: this.habitForm.value.name,
            icono: this.selectedIcon(),
            color: this.selectedColor(),
            frecuencia: this.selectedFrequency(),
        };

        const result = await this.habitService.createHabit(habitDto);

        if (result) {
            console.log('Hábito creado exitosamente:', result);
            this.habitCreated.emit();
            this.closeModal();
            this.resetState();
        } else {
            console.error('Error al crear el hábito');
        }
    }
}