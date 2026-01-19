import { Component, signal } from '@angular/core';
import { CreateTaskModal } from "./components/create-task-modal/create-task-modal";
import { TasksService } from './services/tasks.service';
import { ClassifiedTasks } from './models/task.model';
import { CommonModule } from '@angular/common';
import { TaskColumn } from "./components/task-column/task-column";

@Component({
  selector: 'app-tasks',
  imports: [CreateTaskModal, CommonModule, TaskColumn],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {

  currentDate = new Date();

  tasks = signal<ClassifiedTasks>({
    atrasadas: [],
    hoy: [],
    proximas: [],
  });

  constructor(private tasksService: TasksService) {
    this.loadTasks();
  }

  async loadTasks() {
    const classifiedTasks = await this.tasksService.getClassifiedTasks();
    this.tasks.set(classifiedTasks);
  }




}
