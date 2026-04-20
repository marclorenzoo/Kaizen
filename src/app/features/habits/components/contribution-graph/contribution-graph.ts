import { Component, inject, Input } from '@angular/core';
import { Habit } from '../../models/habits.model';
import { HabitsService } from '../../services/habits.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contribution-graph',
  imports: [CommonModule],
  templateUrl: './contribution-graph.html',
  styleUrl: './contribution-graph.scss',
})
export class ContributionGraph {

  @Input() habit!: Habit;

  constructor(private habitService: HabitsService) { }

  async loadConsitencyData() {
    const data = await this.habitService.getYearConsistencyMap(2026);

  }

}
