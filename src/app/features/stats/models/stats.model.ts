/**
 * Resumen de KPIs principales para las tarjetas de estadísticas
 */
export interface StatsSummary {
    tareasCompletadas: number;
    rachaPromedio: number;
    tasaCumplimiento: number; // Porcentaje 0-100
    diasActivo: number;
}

/**
 * Actividad de un día específico para el gráfico semanal
 */
export interface WeeklyActivity {
    dia: string;        // Nombre del día (Lun, Mar, ...)
    fecha: string;      // 'YYYY-MM-DD'
    tareas: number;
    habitos: number;
}

/**
 * Ranking de un hábito individual
 */
export interface HabitRanking {
    habitoId: string;
    nombre: string;
    icono: string;
    color: string;
    completados: number;
    porcentaje: number; // 0-100
    rachaActual: number;
}

/**
 * Día del mapa de actividad (heatmap)
 */
export interface ActivityDay {
    fecha: string;  // 'YYYY-MM-DD'
    count: number;
    level: 0 | 1 | 2 | 3 | 4; // Intensidad del color
}
