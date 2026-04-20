import { Component, Input, OnChanges } from '@angular/core';
import { ActivityDay } from '../../models/stats.model';
import { CommonModule } from '@angular/common';

interface HeatmapWeek {
    days: ActivityDay[];
}

@Component({
    selector: 'app-activity-heatmap',
    imports: [CommonModule],
    templateUrl: './activity-heatmap.html',
    styleUrl: './activity-heatmap.scss',
})
export class ActivityHeatmap implements OnChanges {
    @Input() data: ActivityDay[] = [];
    @Input() year: number = new Date().getFullYear();

    weeks: HeatmapWeek[] = [];
    monthLabels: { label: string; col: number }[] = [];

    private readonly MONTHS = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ];

    ngOnChanges(): void {
        this.buildGrid();
    }

    private buildGrid(): void {
        if (this.data.length === 0) return;

        // Organizar por semanas (columnas)
        const weeks: HeatmapWeek[] = [];
        let currentWeek: ActivityDay[] = [];

        // Rellenar con celdas vacías al inicio para alinear al día de la semana
        const firstDate = new Date(this.data[0].fecha + 'T12:00:00');
        const startDayOfWeek = firstDate.getDay(); // 0=Dom

        for (let i = 0; i < startDayOfWeek; i++) {
            currentWeek.push({ fecha: '', count: 0, level: 0 });
        }

        for (const day of this.data) {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push({ days: [...currentWeek] });
                currentWeek = [];
            }
        }

        // Rellenar última semana si está incompleta
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push({ fecha: '', count: 0, level: 0 });
            }
            weeks.push({ days: currentWeek });
        }

        this.weeks = weeks;

        // Calcular posiciones de etiquetas de meses
        this.monthLabels = [];
        let lastMonth = -1;

        for (let w = 0; w < weeks.length; w++) {
            for (const day of weeks[w].days) {
                if (!day.fecha) continue;
                const month = new Date(day.fecha + 'T12:00:00').getMonth();
                if (month !== lastMonth) {
                    this.monthLabels.push({ label: this.MONTHS[month], col: w });
                    lastMonth = month;
                }
            }
        }
    }

    getCellColor(level: 0 | 1 | 2 | 3 | 4): string {
        const colors: Record<number, string> = {
            0: '#ebedf0',
            1: '#9be9a8',
            2: '#40c463',
            3: '#30a14e',
            4: '#216e39',
        };
        return colors[level];
    }

    getTooltip(day: ActivityDay): string {
        if (!day.fecha) return '';
        const date = new Date(day.fecha + 'T12:00:00');
        const formatted = date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
        return day.count === 0
            ? `Sin actividad — ${formatted}`
            : `${day.count} actividad${day.count > 1 ? 'es' : ''} — ${formatted}`;
    }
}
