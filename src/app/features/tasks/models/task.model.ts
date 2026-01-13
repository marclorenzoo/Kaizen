/**
 * Prioridad de la tarea
 * Basado en el ENUM prioridad_tarea de Supabase
 */
export type TaskPriority = 'baja' | 'media' | 'alta';

/**
 * Clasificación de tareas por fecha
 * Se calcula en frontend, no existe en la BD
 */
export type TaskClassification = 'atrasadas' | 'hoy' | 'proximas';

/**
 * Opciones de filtro por fecha
 */
export type DateFilterOption = 'hoy' | 'esta_semana' | 'personalizado';

/**
 * Opciones de filtro por estado
 */
export type StatusFilterOption = 'pendientes' | 'completadas' | 'todas';

/**
 * Representa una tarea completa
 * Corresponde a la tabla 'tareas' en Supabase
 */
export interface Task {
    id: string;
    titulo: string;
    descripcion: string | null;
    prioridad: TaskPriority;
    fecha_vencimiento: string; // 'YYYY-MM-DD'
    hora_especifica: string | null; // 'HH:MM:SS'
    es_todo_el_dia: boolean;
    completada: boolean;
    usuario_id: string;
    orden: number;
    created_at: string;
    updated_at: string;
}

/**
 * Datos necesarios para crear una tarea
 * Excluye campos autogenerados
 */
export interface CreateTaskDto {
    titulo: string;
    descripcion?: string;
    prioridad?: TaskPriority;
    fecha_vencimiento: string; // 'YYYY-MM-DD'
    hora_especifica?: string; // 'HH:MM:SS'
    es_todo_el_dia?: boolean;
    orden?: number;
}

/**
 * Datos para actualizar una tarea existente
 * Todos los campos son opcionales
 */
export interface UpdateTaskDto {
    titulo?: string;
    descripcion?: string | null;
    prioridad?: TaskPriority;
    fecha_vencimiento?: string;
    hora_especifica?: string | null;
    es_todo_el_dia?: boolean;
    completada?: boolean;
    orden?: number;
}

/**
 * Agrupación de tareas por clasificación
 */
export interface ClassifiedTasks {
    atrasadas: Task[];
    hoy: Task[];
    proximas: Task[];
}

/**
 * Contador de tareas por clasificación
 */
export interface TaskCount {
    atrasadas: number;
    hoy: number;
    proximas: number;
    total: number;
}

/**
 * Interface para los filtros de tareas
 * Todos los campos son opcionales para permitir combinaciones
 */
export interface TaskFilters {
    // Filtro por prioridad (puede ser múltiple)
    prioridades?: TaskPriority[];

    // Filtro por estado
    estado?: StatusFilterOption;

    // Filtro por fecha
    fecha?: DateFilterOption;

    // Si es fecha personalizada, especificar rango
    fechaInicio?: string; // 'YYYY-MM-DD'
    fechaFin?: string;    // 'YYYY-MM-DD'
}