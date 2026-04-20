import { Component, Input } from '@angular/core';
import { WeeklyActivity } from '../../models/stats.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-weekly-chart',
    imports: [CommonModule],
    templateUrl: './weekly-chart.html',
    styleUrl: './weekly-chart.scss',
})
export class WeeklyChart {
    @Input() data: WeeklyActivity[] = [];

    get maxValue(): number {
        if (this.data.length === 0) return 1;
        return Math.max(1, ...this.data.map(d => d.tareas + d.habitos));
    }

    getBarHeight(value: number): number {
        return Math.max(4, (value / this.maxValue) * 100);
    }

    getTotalForDay(day: WeeklyActivity): number {
        return day.tareas + day.habitos;
    }
}
