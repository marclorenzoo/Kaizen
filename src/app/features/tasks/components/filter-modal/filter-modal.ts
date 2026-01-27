import { Component, EventEmitter, Input, Output, signal, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilters, TaskPriority, DateFilterOption } from '../../models/task.model';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.scss',
})
export class FilterModal implements OnChanges {
  @Input() isOpen = false;
  @Input() currentFilters: TaskFilters = {};
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<TaskFilters>();
  @Output() clear = new EventEmitter<void>();

  // Estados internos del formulario
  selectedPriorities = signal<Set<TaskPriority>>(new Set());
  selectedDate = signal<DateFilterOption | undefined>(undefined);

  ngOnChanges() {
    // Inicializar con filtros actuales
    if (this.currentFilters.prioridades) {
      this.selectedPriorities.set(new Set(this.currentFilters.prioridades));
    }
    if (this.currentFilters.fecha) {
      this.selectedDate.set(this.currentFilters.fecha);
    }
  }

  togglePriority(priority: TaskPriority) {
    const priorities = new Set(this.selectedPriorities());
    if (priorities.has(priority)) {
      priorities.delete(priority);
    } else {
      priorities.add(priority);
    }
    this.selectedPriorities.set(priorities);
  }

  isPrioritySelected(priority: TaskPriority): boolean {
    return this.selectedPriorities().has(priority);
  }

  selectDate(date: DateFilterOption) {
    this.selectedDate.set(
      this.selectedDate() === date ? undefined : date
    );
  }

  isDateSelected(date: DateFilterOption): boolean {
    return this.selectedDate() === date;
  }

  onClose() {
    this.close.emit();
  }

  onClear() {
    this.selectedPriorities.set(new Set());
    this.selectedDate.set(undefined);
    this.clear.emit();
  }

  onApply() {
    const filters: TaskFilters = {};

    const priorities = Array.from(this.selectedPriorities());
    if (priorities.length > 0) {
      filters.prioridades = priorities;
    }

    if (this.selectedDate()) {
      filters.fecha = this.selectedDate();
    }

    this.apply.emit(filters);
  }
}