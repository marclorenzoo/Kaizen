import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Habit } from '../../models/habits.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-habit-card',
  imports: [CommonModule],
  templateUrl: './habit-card.html',
  styleUrl: './habit-card.scss',
})
export class HabitCard {

  @Input() habit!: Habit;
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() editHabit = new EventEmitter<Habit>();


  constructor(private sanitizer: DomSanitizer) { }

  getIconSvg(): SafeHtml {
    const iconMap: Record<string, string> = {
      'person': '<circle cx="12" cy="8" r="5"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>',
      'book': '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
      'droplet': '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
      'dumbbell': '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
    };

    const svgPath = iconMap[this.habit.icono] || iconMap['person'];
    const fullSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" 
           class="w-8 h-8" 
           viewBox="0 0 24 24" 
           fill="none" 
           stroke="currentColor" 
           stroke-width="2">
        ${svgPath}
      </svg>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(fullSvg);
  }

  onToggleComplete(event: Event): void {
    event.preventDefault();
    this.toggleComplete.emit(this.habit.id);

  }

  onEdit(): void {
    this.editHabit.emit(this.habit);
  }

}
