import { Component, Input } from '@angular/core';
import { StatsSummary } from '../../models/stats.model';

@Component({
    selector: 'app-summary-cards',
    imports: [],
    templateUrl: './summary-cards.html',
    styleUrl: './summary-cards.scss',
})
export class SummaryCards {
    @Input() summary: StatsSummary | null = null;

    cards = [
        {
            key: 'tareasCompletadas' as const,
            label: 'Tareas Completadas',
            icon: 'pi pi-check-square',
            colorClass: 'bg-blue-50 text-blue-600',
            iconBg: 'bg-blue-100',
        },
        {
            key: 'rachaPromedio' as const,
            label: 'Racha Promedio',
            icon: 'pi pi-bolt',
            colorClass: 'bg-amber-50 text-amber-600',
            iconBg: 'bg-amber-100',
            suffix: ' días',
        },
        {
            key: 'tasaCumplimiento' as const,
            label: 'Cumplimiento Hoy',
            icon: 'pi pi-chart-line',
            colorClass: 'bg-emerald-50 text-emerald-600',
            iconBg: 'bg-emerald-100',
            suffix: '%',
        },
        {
            key: 'diasActivo' as const,
            label: 'Días Activo',
            icon: 'pi pi-calendar',
            colorClass: 'bg-purple-50 text-purple-600',
            iconBg: 'bg-purple-100',
        },
    ];

    getValue(key: string): number {
        if (!this.summary) return 0;
        return (this.summary as any)[key] ?? 0;
    }
}
