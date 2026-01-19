import { Component, Input } from '@angular/core';
import { Task, TaskClassification } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {

  @Input() task!: Task;
  @Input() classification!: TaskClassification; // 'atrasadas' | 'hoy' | 'proximas'

  /**
   * Calcula la información de fecha según la clasificación
   * Retorna: { text, color, icon }
   */
  get dateInfo() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(this.task.fecha_vencimiento);
    taskDate.setHours(0, 0, 0, 0);

    switch (this.classification) {
      case 'atrasadas':
        return this.getOverdueInfo(today, taskDate);

      case 'hoy':
        return this.getTodayInfo();

      case 'proximas':
        return this.getUpcomingInfo(taskDate);

      default:
        return { text: '', color: '', icon: 'calendar' };
    }
  }

  /**
   * Información para tareas atrasadas
   */
  private getOverdueInfo(today: Date, taskDate: Date) {
    const diffTime = today.getTime() - taskDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return {
        text: 'Ayer',
        color: 'text-error',
        icon: 'calendar'
      };
    } else {
      return {
        text: `${diffDays} días`,
        color: 'text-error',
        icon: 'calendar'
      };
    }
  }

  /**
   * Información para tareas de hoy
   */
  private getTodayInfo() {
    if (this.task.es_todo_el_dia) {
      return {
        text: 'Todo el día',
        color: 'text-base-content',
        icon: 'clock'
      };
    } else if (this.task.hora_especifica) {
      // Formatear hora de HH:MM:SS a HH:MM AM/PM
      const [hours, minutes] = this.task.hora_especifica.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;

      return {
        text: `${hour12}:${minutes} ${ampm}`,
        color: 'text-base-content',
        icon: 'clock'
      };
    } else {
      return {
        text: 'Todo el día',
        color: 'text-base-content',
        icon: 'clock'
      };
    }
  }

  /**
   * Información para tareas próximas
   */
  private getUpcomingInfo(taskDate: Date) {
    // Formato: "24 Oct" o similar
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const day = taskDate.getDate();
    const month = months[taskDate.getMonth()];

    return {
      text: `${day} ${month}`,
      color: 'text-base-content',
      icon: 'calendar'
    };
  }

  /**
   * Configuración de prioridad (ya la tenías, la dejo aquí por claridad)
   */
  get priorityConfig() {
    const config = {
      baja: { class: 'bg-blue-50 text-blue-700 border-0 ring-1 ring-blue-700/10', label: 'Baja' },
      media: { class: 'bg-yellow-50 text-yellow-700 border-0 ring-1 ring-yellow-700/10', label: 'Media' },
      alta: { class: 'bg-red-50 text-red-700 border-0 ring-1 ring-red-700/10', label: 'Alta' }
    };
    return config[this.task.prioridad];
  }

}
