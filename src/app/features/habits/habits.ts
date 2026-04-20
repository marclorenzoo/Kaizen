import { Component, computed, signal, ViewChild } from '@angular/core';
import { CreateHabitModal } from './components/create-habit-modal/create-habit-modal';
import { EditHabitModal } from './components/edit-habit-modal/edit-habit-modal';
import { Habit } from './models/habits.model';
import { HabitsService } from './services/habits.service';
import { HabitCard } from './components/habit-card/habit-card';

@Component({
  selector: 'app-habits',
  imports: [CreateHabitModal, EditHabitModal, HabitCard],
  templateUrl: './habits.html',
  styleUrl: './habits.scss',
})
export class Habits {

  habits = signal<Habit[]>([]);
  pendingHabits = computed(() => this.habits().filter(h => !h.completado));
  completedHabits = computed(() => this.habits().filter(h => h.completado));
  @ViewChild(CreateHabitModal) createHabitModal!: CreateHabitModal;
  @ViewChild(EditHabitModal) editHabitModal!: EditHabitModal;

  constructor(private habitService: HabitsService) {
    this.loadHabits()

    this.habitService.refreshNeeded.subscribe(() => {
      this.loadHabits();
    });

  }

  async loadHabits() {
    await this.habitService.resetExpiredHabits();
    const allHabits = await this.habitService.getAllHabits();
    this.habits.set(allHabits);
  }

  openCreateHabitModal() {
    this.createHabitModal.showModal();
  }

  openEditHabitModal(habit: Habit) {
    this.editHabitModal.showModal(habit);
  }

  async onToggleHabit(habitId: string) {
    const success = await this.habitService.toggleHabitCompletion(habitId);
    if (success) {
      await this.loadHabits();
    } else {
      console.error('Error al actualizar hábito');
    }
  }
}

