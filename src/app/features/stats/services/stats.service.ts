import { Injectable } from '@angular/core';
import { HabitsService } from '../../habits/services/habits.service';
import { TasksService } from '../../tasks/services/tasks.service';
import {
    StatsSummary,
    WeeklyActivity,
    HabitRanking,
    ActivityDay,
} from '../models/stats.model';

@Injectable({
    providedIn: 'root',
})
export class StatsService {

    constructor(
        private habitsService: HabitsService,
        private tasksService: TasksService,
    ) { }

    // ============================================
    // RESUMEN (KPI Cards)
    // ============================================

    async getSummary(): Promise<StatsSummary> {
        const [habitsSummary, completedTasks, allHabits] = await Promise.all([
            this.habitsService.getHabitsSummary(),
            this.tasksService.getCompletedTasks(),
            this.habitsService.getAllHabits(),
        ]);

        // Tasa de cumplimiento: hábitos completados hoy / total hábitos
        const tasaCumplimiento = habitsSummary.total_habitos > 0
            ? Math.round((habitsSummary.habitos_completados_hoy / habitsSummary.total_habitos) * 100)
            : 0;

        return {
            tareasCompletadas: completedTasks.length,
            rachaPromedio: habitsSummary.racha_promedio,
            tasaCumplimiento,
            diasActivo: habitsSummary.dias_activo,
        };
    }

    // ============================================
    // ACTIVIDAD SEMANAL (Bar Chart)
    // ============================================

    async getWeeklyActivity(): Promise<WeeklyActivity[]> {
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const today = new Date();
        const result: WeeklyActivity[] = [];

        // Generar los últimos 7 días
        const dates: string[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }

        // Obtener datos de hábitos completados en la última semana
        const weekStart = dates[0];
        const weekEnd = dates[dates.length - 1];

        const [habitsHistory, completedTasks] = await Promise.all([
            this.habitsService.getAllHabitsHistory({
                fecha_inicio: weekStart,
                fecha_fin: weekEnd,
            }),
            this.tasksService.getCompletedTasks(),
        ]);

        // Contar hábitos por fecha
        const habitsByDate: Record<string, number> = {};
        for (const h of habitsHistory) {
            const fecha = h.fecha_completado;
            habitsByDate[fecha] = (habitsByDate[fecha] || 0) + 1;
        }

        // Contar tareas por fecha de completado
        const tasksByDate: Record<string, number> = {};
        for (const t of completedTasks) {
            // Usamos updated_at como fecha de completado
            const fecha = new Date(t.updated_at).toISOString().split('T')[0];
            if (fecha >= weekStart && fecha <= weekEnd) {
                tasksByDate[fecha] = (tasksByDate[fecha] || 0) + 1;
            }
        }

        for (const fecha of dates) {
            const d = new Date(fecha + 'T12:00:00');
            result.push({
                dia: diasSemana[d.getDay()],
                fecha,
                tareas: tasksByDate[fecha] || 0,
                habitos: habitsByDate[fecha] || 0,
            });
        }

        return result;
    }

    // ============================================
    // RANKING DE HÁBITOS
    // ============================================

    async getHabitsRanking(): Promise<HabitRanking[]> {
        const habits = await this.habitsService.getAllHabits();
        const rankings: HabitRanking[] = [];

        for (const habit of habits) {
            const stats = await this.habitsService.getHabitStats(habit.id);
            if (stats) {
                rankings.push({
                    habitoId: habit.id,
                    nombre: stats.nombre,
                    icono: habit.icono,
                    color: habit.color,
                    completados: stats.total_dias_completados,
                    porcentaje: Math.min(stats.porcentaje_cumplimiento, 100),
                    rachaActual: stats.racha_actual,
                });
            }
        }

        // Ordenar de mayor a menor porcentaje
        return rankings.sort((a, b) => b.porcentaje - a.porcentaje);
    }

    // ============================================
    // MAPA DE ACTIVIDAD (Heatmap)
    // ============================================

    async getActivityHeatmap(year: number): Promise<ActivityDay[]> {
        const [consistencyMap, completedTasks] = await Promise.all([
            this.habitsService.getYearConsistencyMap(year),
            this.tasksService.getCompletedTasks(),
        ]);

        // Combinar actividad de hábitos y tareas en un mapa por fecha
        const activityByDate: Record<string, number> = {};

        for (const entry of consistencyMap) {
            activityByDate[entry.fecha] = (activityByDate[entry.fecha] || 0) + entry.total_completados;
        }

        for (const task of completedTasks) {
            const fecha = new Date(task.updated_at).toISOString().split('T')[0];
            if (fecha.startsWith(String(year))) {
                activityByDate[fecha] = (activityByDate[fecha] || 0) + 1;
            }
        }

        // Determinar el máximo para calcular niveles
        const maxCount = Math.max(1, ...Object.values(activityByDate));

        // Generar todos los días del año
        const result: ActivityDay[] = [];
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const fecha = d.toISOString().split('T')[0];
            const count = activityByDate[fecha] || 0;

            // No mostrar días futuros
            if (d > new Date()) {
                result.push({ fecha, count: 0, level: 0 });
                continue;
            }

            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (count > 0) {
                const ratio = count / maxCount;
                if (ratio <= 0.25) level = 1;
                else if (ratio <= 0.5) level = 2;
                else if (ratio <= 0.75) level = 3;
                else level = 4;
            }

            result.push({ fecha, count, level });
        }

        return result;
    }
}
