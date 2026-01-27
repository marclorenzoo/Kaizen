import { Component, inject, signal, ViewChild } from '@angular/core';
import { CreateTaskModal } from "./components/create-task-modal/create-task-modal";
import { FilterModal } from "./components/filter-modal/filter-modal";
import { TasksService } from './services/tasks.service';
import { ToastService } from '../../core/services/toast.service';
import { ClassifiedTasks, TaskClassification, TaskFilters } from './models/task.model';
import { CommonModule } from '@angular/common';
import { TaskColumn } from "./components/task-column/task-column";
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-tasks',
  imports: [CreateTaskModal, CommonModule, TaskColumn, FilterModal],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {

  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  currentDate = new Date();

  tasks = signal<ClassifiedTasks>({
    atrasadas: [],
    hoy: [],
    proximas: [],
  });

  // Estado de filtros activos
  activeFilters = signal<TaskFilters>({});

  // Control de modal de filtros
  isFilterModalOpen = signal(false);

  // Tab activo en mobile (por defecto "atrasadas")
  activeMobileTab = signal<TaskClassification>('atrasadas');

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
    const filters = this.activeFilters();
    const classifiedTasks = await this.tasksService.getFilteredClassifiedTasks(filters);
    this.tasks.set(classifiedTasks);
  }

  // ===================================
  // GESTIÓN DE FILTROS
  // ===================================

  openFilterModal() {
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal() {
    this.isFilterModalOpen.set(false);
  }

  applyFilters(filters: TaskFilters) {
    this.activeFilters.set(filters);
    this.loadTasks();
    this.closeFilterModal();

    // Toast de confirmación
    this.toastService.show('Filtros aplicados', 'Las tareas se han filtrado correctamente');
  }

  clearFilters() {
    this.activeFilters.set({});
    this.loadTasks();
    this.closeFilterModal();

    this.toastService.show('Filtros limpiados', 'Se muestran todas las tareas');
  }

  hasActiveFilters(): boolean {
    const filters = this.activeFilters();
    return !!(
      (filters.prioridades && filters.prioridades.length > 0) ||
      filters.fecha
    );
  }

  // ===================================
  // GESTIÓN DE TABS MOBILE
  // ===================================

  setActiveMobileTab(tab: TaskClassification) {
    this.activeMobileTab.set(tab);
  }

  // ===================================
  // MODAL DE CREAR TAREA
  // ===================================

  @ViewChild(CreateTaskModal) createTaskModal!: CreateTaskModal;

  openCreateTaskModal() {
    this.createTaskModal.showModal();
  }

}