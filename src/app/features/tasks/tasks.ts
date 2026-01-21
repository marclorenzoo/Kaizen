import { Component, signal, ViewChild } from '@angular/core';
import { CreateTaskModal } from "./components/create-task-modal/create-task-modal";
import { TasksService } from './services/tasks.service';
import { ToastService } from '../../core/services/toast.service';
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

  constructor(
    private tasksService: TasksService,
    public toastService: ToastService
  ) {
    this.loadTasks();
    this.tasksService.refreshNeeded.subscribe(() => {
      this.loadTasks();
    });
  }

  async loadTasks() {
    const classifiedTasks = await this.tasksService.getClassifiedTasks();
    this.tasks.set(classifiedTasks);
  }

  @ViewChild(CreateTaskModal) createTaskModal!: CreateTaskModal;

  openCreateTaskModal() {
    this.createTaskModal.showModal();
  }

}
