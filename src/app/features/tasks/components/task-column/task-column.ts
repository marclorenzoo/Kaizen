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

}
