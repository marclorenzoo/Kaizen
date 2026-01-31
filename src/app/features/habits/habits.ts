import { Component, ViewChild } from '@angular/core';
import { CreateHabitModal } from './components/create-habit-modal/create-habit-modal';

@Component({
  selector: 'app-habits',
  imports: [CreateHabitModal],
  templateUrl: './habits.html',
  styleUrl: './habits.scss',
})
export class Habits {

  @ViewChild(CreateHabitModal) createHabitModal!: CreateHabitModal;

  openCreateHabitModal() {
    this.createHabitModal.showModal();
  }
}
