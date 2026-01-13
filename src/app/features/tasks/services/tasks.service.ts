import { Injectable } from '@angular/core';
import {
  CreateTaskDto,
  Task,
  ClassifiedTasks,
  UpdateTaskDto,
  TaskCount,
  TaskFilters
} from '../models/task.model';
import { SupabaseService } from '../../../core/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  constructor(private supabaseService: SupabaseService) { }

  // ============================================
  // CRUD BÁSICO
  // ============================================

  /**
   * Crea una nueva tarea
   * Asigna automáticamente el usuario_id del usuario autenticado
   */
  async createTask(dto: CreateTaskDto): Promise<Task | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .insert({
          ...dto,
          usuario_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear tarea:', error);
        return null;
      }

      return data as Task;
    } catch (error) {
      console.error('Error inesperado al crear tarea:', error);
      return null;
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .update({
          ...dto
        })
        .eq('id', id)
        .eq('usuario_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar tarea:', error);
        return null;
      }

      return data as Task;
    } catch (error) {
      console.error('Error inesperado al actualizar tarea:', error);
      return null;
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: string): Promise<Task | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .delete()
        .eq('id', id)
        .eq('usuario_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error al eliminar tarea:', error);
        return null;
      }

      return data as Task;
    } catch (error) {
      console.error('Error inesperado al eliminar tarea:', error);
      return null;
    }
  }

  /**
   * Alterna el estado de completado de una tarea
   */
  async toggleTaskCompletion(id: string): Promise<Task | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      // PASO 1: Obtener la tarea actual para saber su estado
      const { data: currentTask, error: fetchError } = await this.supabaseService
        .getClient()
        .from('tareas')
        .select('completada')
        .eq('id', id)
        .eq('usuario_id', user.id)
        .single();

      if (fetchError || !currentTask) {
        console.error('Error al obtener tarea:', fetchError);
        return null;
      }

      // PASO 2: Invertir el valor y actualizar
      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .update({ completada: !currentTask.completada })
        .eq('id', id)
        .eq('usuario_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error al cambiar estado de tarea:', error);
        return null;
      }

      return data as Task;
    } catch (error) {
      console.error('Error inesperado al cambiar estado:', error);
      return null;
    }
  }

  // ============================================
  // OBTENCIÓN DE TAREAS
  // ============================================

  /**
   * Obtiene todas las tareas del usuario actual (completadas y sin completar)
   * Ordenadas por fecha de vencimiento ascendente
   */
  private async getAllTasksForClassification(): Promise<Task[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .select('*')
        .eq('usuario_id', user.id)
        .order('fecha_vencimiento', { ascending: true });

      if (error) {
        console.error('Error al obtener tareas:', error);
        return [];
      }

      return (data as Task[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener tareas:', error);
      return [];
    }
  }

  /**
   * Obtiene una tarea específica por su ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', user.id)
        .single();

      if (error) {
        console.error('Error al obtener tarea por ID:', error);
        return null;
      }

      return data as Task;
    } catch (error) {
      console.error('Error inesperado al obtener tarea por ID:', error);
      return null;
    }
  }

  /**
   * Obtiene todas las tareas COMPLETADAS del usuario actual
   * Ordenadas por fecha de actualización descendente (más recientes primero)
   */
  async getCompletedTasks(): Promise<Task[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('completada', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error al obtener tareas completadas:', error);
        return [];
      }

      return (data as Task[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener tareas completadas:', error);
      return [];
    }
  }

  // ============================================
  // CLASIFICACIÓN DE TAREAS
  // ============================================

  /**
   * Clasifica tareas por fecha con la lógica correcta:
   * - Atrasadas: Fecha < hoy Y NO completadas
   * - Hoy: Fecha = hoy (completadas y sin completar)
   * - Próximas: Fecha > hoy Y NO completadas
   */
  private classifyTasksByDate(tasks: Task[]): ClassifiedTasks {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    return {
      atrasadas: tasks.filter((task) => {
        const fechaTarea = new Date(task.fecha_vencimiento);
        return fechaTarea < hoy && !task.completada;
      }),

      hoy: tasks.filter((task) => {
        const fechaTarea = new Date(task.fecha_vencimiento);
        return fechaTarea >= hoy && fechaTarea < manana;
      }),

      proximas: tasks.filter((task) => {
        const fechaTarea = new Date(task.fecha_vencimiento);
        return fechaTarea >= manana && !task.completada;
      }),
    };
  }

  /**
   * Obtiene las tareas clasificadas (sin filtros)
   */
  async getClassifiedTasks(): Promise<ClassifiedTasks> {
    try {
      const allTasks = await this.getAllTasksForClassification();
      return this.classifyTasksByDate(allTasks);
    } catch (error) {
      console.error('Error al obtener tareas clasificadas:', error);
      return {
        atrasadas: [],
        hoy: [],
        proximas: [],
      };
    }
  }

  // ============================================
  // FILTRADO DE TAREAS
  // ============================================

  /**
   * Filtra tareas según múltiples criterios combinados
   */
  private filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    let filteredTasks = [...tasks];

    // FILTRO 1: Por prioridad (puede ser múltiple)
    if (filters.prioridades && filters.prioridades.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        filters.prioridades!.includes(task.prioridad)
      );
    }

    // FILTRO 2: Por estado (completadas/pendientes/todas)
    if (filters.estado && filters.estado !== 'todas') {
      const includeCompleted = filters.estado === 'completadas';
      filteredTasks = filteredTasks.filter(task =>
        task.completada === includeCompleted
      );
    }

    // FILTRO 3: Por fecha
    if (filters.fecha) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      switch (filters.fecha) {
        case 'hoy':
          const manana = new Date(hoy);
          manana.setDate(manana.getDate() + 1);

          filteredTasks = filteredTasks.filter(task => {
            const fechaTarea = new Date(task.fecha_vencimiento);
            return fechaTarea >= hoy && fechaTarea < manana;
          });
          break;

        case 'esta_semana':
          const finSemana = new Date(hoy);
          finSemana.setDate(finSemana.getDate() + 7);

          filteredTasks = filteredTasks.filter(task => {
            const fechaTarea = new Date(task.fecha_vencimiento);
            return fechaTarea >= hoy && fechaTarea < finSemana;
          });
          break;

        case 'personalizado':
          if (filters.fechaInicio) {
            const inicio = new Date(filters.fechaInicio);
            filteredTasks = filteredTasks.filter(task => {
              const fechaTarea = new Date(task.fecha_vencimiento);
              return fechaTarea >= inicio;
            });
          }

          if (filters.fechaFin) {
            const fin = new Date(filters.fechaFin);
            fin.setHours(23, 59, 59, 999);
            filteredTasks = filteredTasks.filter(task => {
              const fechaTarea = new Date(task.fecha_vencimiento);
              return fechaTarea <= fin;
            });
          }
          break;
      }
    }

    return filteredTasks;
  }

  /**
   * Aplica filtros a las tareas ya clasificadas
   */
  private filterClassifiedTasks(
    classifiedTasks: ClassifiedTasks,
    filters: TaskFilters
  ): ClassifiedTasks {
    return {
      atrasadas: this.filterTasks(classifiedTasks.atrasadas, filters),
      hoy: this.filterTasks(classifiedTasks.hoy, filters),
      proximas: this.filterTasks(classifiedTasks.proximas, filters),
    };
  }

  /**
   * Obtiene tareas clasificadas Y filtradas
   * FUNCIÓN PRINCIPAL para usar en el componente
   */
  async getFilteredClassifiedTasks(filters?: TaskFilters): Promise<ClassifiedTasks> {
    try {
      const classifiedTasks = await this.getClassifiedTasks();

      if (!filters || Object.keys(filters).length === 0) {
        return classifiedTasks;
      }

      return this.filterClassifiedTasks(classifiedTasks, filters);
    } catch (error) {
      console.error('Error al obtener tareas filtradas:', error);
      return {
        atrasadas: [],
        hoy: [],
        proximas: [],
      };
    }
  }

  // ============================================
  // CONTADORES Y ESTADÍSTICAS
  // ============================================

  /**
   * Obtiene el conteo de tareas por categoría
   */
  async getTaskCount(): Promise<TaskCount> {
    try {
      const classified = await this.getClassifiedTasks();

      return {
        atrasadas: classified.atrasadas.length,
        hoy: classified.hoy.length,
        proximas: classified.proximas.length,
        total: classified.atrasadas.length + classified.hoy.length + classified.proximas.length
      };
    } catch (error) {
      console.error('Error al obtener conteo de tareas:', error);
      return {
        atrasadas: 0,
        hoy: 0,
        proximas: 0,
        total: 0
      };
    }
  }
}