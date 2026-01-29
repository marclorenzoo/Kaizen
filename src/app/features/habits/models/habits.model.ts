/**
 * Frecuencia del hábito
 * Basado en el ENUM frecuencia_habito de Supabase
 */
export type HabitFrequency = 'diaria' | 'semanal' | 'mensual';

/**
 * Colores por defecto para los hábitos
 * El usuario puede seleccionar estos o cualquier color personalizado en HEX
 */
export const DEFAULT_HABIT_COLORS = [
    '#5B5FEF', // Púrpura (por defecto en las imágenes)
    '#48C9B0', // Verde turquesa
    '#E74C3C', // Rojo
    '#F39C12', // Naranja
    '#3498DB', // Azul
] as const;

export type DefaultHabitColor = typeof DEFAULT_HABIT_COLORS[number];

/**
 * Iconos por defecto para los hábitos
 * Basados en Lucide Icons (https://lucide.dev)
 * El usuario puede seleccionar estos o cualquier otro de la librería
 */
export const DEFAULT_HABIT_ICONS = [
    'circle-user-round', // Meditación (el que aparece en tu imagen)
    'book-open',         // Lectura
    'droplet',          // Agua/hidratación
    'dumbbell',         // Ejercicio
    'bed',              // Dormir/descanso
] as const;

export type DefaultHabitIcon = typeof DEFAULT_HABIT_ICONS[number];

/**
 * Representa un hábito completo
 * Corresponde a la tabla 'habitos' en Supabase
 */
export interface Habit {
    id: string;
    nombre: string;
    icono: string; // Nombre del icono de Lucide
    color: string; // Color en formato HEX (#RRGGBB)
    frecuencia: HabitFrequency;
    completado: boolean; // Estado actual (hoy/esta semana/este mes)
    racha_actual: number;
    racha_maxima: number;
    usuario_id: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Representa un registro de hábito completado
 * Corresponde a la tabla 'habitos_completados' en Supabase
 */
export interface HabitCompleted {
    id: string;
    habito_id: string;
    usuario_id: string;
    fecha_completado: string; // 'YYYY-MM-DD'
    created_at: string;
}

/**
 * Datos necesarios para crear un hábito
 * Excluye campos autogenerados
 */
export interface CreateHabitDto {
    nombre: string;
    icono?: string; // Si no se proporciona, usar DEFAULT_HABIT_ICONS[0]
    color?: string; // Si no se proporciona, usar DEFAULT_HABIT_COLORS[0]
    frecuencia?: HabitFrequency; // Por defecto 'diaria'
}

/**
 * Datos para actualizar un hábito existente
 * Todos los campos son opcionales
 */
export interface UpdateHabitDto {
    nombre?: string;
    icono?: string;
    color?: string;
    frecuencia?: HabitFrequency;
    completado?: boolean;
    activo?: boolean;
}

/**
 * Datos para marcar un hábito como completado
 */
export interface MarkHabitCompletedDto {
    habito_id: string;
    fecha_completado?: string; // Por defecto fecha actual
}

/**
 * Datos del mapa de constancia
 * Representa cuántos hábitos se completaron en una fecha específica
 */
export interface HabitConsistencyMap {
    fecha: string; // 'YYYY-MM-DD'
    total_completados: number;
}

/**
 * Estadísticas de un hábito específico
 */
export interface HabitStats {
    habito_id: string;
    nombre: string;
    total_dias_completados: number;
    racha_actual: number;
    racha_maxima: number;
    porcentaje_cumplimiento: number; // % basado en días desde creación
    ultimo_completado: string | null; // 'YYYY-MM-DD' o null si nunca
}

/**
 * Resumen general de todos los hábitos del usuario
 */
export interface HabitsSummary {
    total_habitos: number;
    habitos_completados_hoy: number;
    racha_promedio: number;
    mejor_racha: number;
    dias_activo: number; // Días desde que creó su primer hábito
}

/**
 * Filtros para consultar el historial de hábitos
 */
export interface HabitHistoryFilters {
    habito_id?: string; // Filtrar por hábito específico
    fecha_inicio?: string; // 'YYYY-MM-DD'
    fecha_fin?: string; // 'YYYY-MM-DD'
    ano?: number; // Filtrar por año específico (ej: 2026)
    mes?: number; // Filtrar por mes específico (1-12)
}

/**
 * Datos para el calendario/mapa de constancia anual
 * Similar a GitHub contributions
 */
export interface YearConsistencyData {
    ano: number;
    datos: HabitConsistencyMap[];
    total_dias_con_actividad: number;
    max_habitos_en_un_dia: number;
}

/**
 * Progreso de un hábito en un período específico
 */
export interface HabitProgress {
    habito_id: string;
    periodo: 'semana' | 'mes' | 'ano';
    completados: number;
    esperados: number; // Según la frecuencia
    porcentaje: number;
}

/**
 * Opciones de agrupación para estadísticas
 */
export type GroupByOption = 'dia' | 'semana' | 'mes' | 'ano';

/**
 * Datos agrupados de hábitos completados
 * Útil para gráficos y estadísticas
 */
export interface GroupedHabitData {
    periodo: string; // Formato depende del groupBy (ej: '2026-01', '2026-W04', '2026-01-15')
    total: number;
    habitos: {
        habito_id: string;
        nombre: string;
        cantidad: number;
    }[];
}