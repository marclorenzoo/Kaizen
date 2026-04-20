import { Component, OnInit, signal } from '@angular/core';
import { StatsService } from './services/stats.service';
import { StatsSummary, WeeklyActivity, HabitRanking, ActivityDay } from './models/stats.model';
import { SummaryCards } from './components/summary-cards/summary-cards';
import { WeeklyChart } from './components/weekly-chart/weekly-chart';
import { HabitsRanking } from './components/habits-ranking/habits-ranking';
import { ActivityHeatmap } from './components/activity-heatmap/activity-heatmap';

@Component({
  selector: 'app-stats',
  imports: [SummaryCards, WeeklyChart, HabitsRanking, ActivityHeatmap],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  summary = signal<StatsSummary | null>(null);
  weeklyActivity = signal<WeeklyActivity[]>([]);
  habitsRanking = signal<HabitRanking[]>([]);
  heatmapData = signal<ActivityDay[]>([]);
  currentYear = new Date().getFullYear();
  isLoading = signal(true);

  constructor(private statsService: StatsService) { }

  async ngOnInit() {
    await this.loadStats();
  }

  async loadStats() {
    this.isLoading.set(true);

    try {
      const [summary, weekly, ranking, heatmap] = await Promise.all([
        this.statsService.getSummary(),
        this.statsService.getWeeklyActivity(),
        this.statsService.getHabitsRanking(),
        this.statsService.getActivityHeatmap(this.currentYear),
      ]);

      this.summary.set(summary);
      this.weeklyActivity.set(weekly);
      this.habitsRanking.set(ranking);
      this.heatmapData.set(heatmap);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
