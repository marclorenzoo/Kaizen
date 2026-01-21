import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskCard } from "../task-card/task-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-column',
  imports: [TaskCard, CommonModule],
  templateUrl: './task-column.html',
  styleUrl: './task-column.scss',
})
export class TaskColumn {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() classification: 'atrasadas' | 'hoy' | 'proximas' = 'hoy';
  @Input() color: string = 'blue';
  @Input() badgeClass: string = '';
  @Output() taskUpdated = new EventEmitter<void>();
  @Output() createTaskClicked = new EventEmitter<void>();

  onTaskUpdated() {
    this.taskUpdated.emit();
  }

  onAddClick() {
    this.createTaskClicked.emit();
  }

  get emptyState() {
    switch (this.classification) {
      case 'atrasadas':
        return {
          title: '¡Increíble!',
          message: 'No tienes tareas atrasadas hoy.',
          iconBg: 'bg-red-50',
          iconColor: 'text-red-400',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' // Checkmark badge
        };
      case 'hoy':
        return {
          title: '¡Todo al día!',
          message: 'Es un buen momento para descansar.',
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-400',
          iconPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' // Sparkles
        };
      case 'proximas':
        return {
          title: 'Despejado',
          message: 'No hay tareas próximas programadas.',
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-400',
          iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' // Calendar
        };
      default:
        return {
          title: 'Sin tareas',
          message: 'No hay tareas en esta lista.',
          iconBg: 'bg-gray-50',
          iconColor: 'text-gray-400',
          iconPath: ''
        };
    }
  }

}
