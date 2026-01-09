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

  /**
   * 1. Crea una nueva tarea
   * Asigna automáticamente el usuario_id del usuario autenticado
   */
  async createTask(dto: CreateTaskDto): Promise<Task | null> {
    try {
      // Obtener el usuario actual
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      // Insertar la tarea en Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .insert({
          ...dto,
          usuario_id: user.id, // Asignamos el usuario automáticamente
        })
        .select() // Para que nos devuelva la tarea creada
        .single(); // Esperamos un solo registro

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

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    try {
      // Obtener el usuario actual
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      // Insertar la tarea en Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .update({
          ...dto
        })
        .eq('id', id)
        .eq('usuario_id', user.id)
        .select() // Para que nos devuelva la tarea creada
        .single(); // Esperamos un solo registro

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

  async deleteTask(id: string): Promise<Task | null> {
    try {
      // Obtener el usuario actual
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      // Insertar la tarea en Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .from('tareas')
        .delete()
        .eq('id', id)
        .eq('usuario_id', user.id)
        .select() // Para que nos devuelva la tarea creada
        .single(); // Esperamos un solo registro

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
 * Obtiene todas las tareas del usuario actual (completadas y sin completar)
 * Ordenadas por fecha de vencimiento ascendente
 * NOTA: Esta función ahora trae TODAS las tareas para poder clasificar correctamente
 */
  async getAllTasksForClassification(): Promise<Task[]> {
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
        .eq('usuario_id', user.id) // Solo tareas del usuario
        .order('fecha_vencimiento', { ascending: true }); // Más cercanas primero

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
   * Clasifica tareas por fecha con la lógica correcta:
   * - Atrasadas: Fecha < hoy Y NO completadas
   * - Hoy: Fecha = hoy (completadas y sin completar)
   * - Próximas: Fecha > hoy Y NO completadas
   */
  private classifyTasksByDate(tasks: Task[]): ClassifiedTasks {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Inicio del día de hoy (00:00:00)

    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1); // Inicio del día de mañana

    return {
      // Atrasadas: Antes de hoy Y sin completar
      atrasadas: tasks.filter((task) => {
        const fechaTarea = new Date(task.fecha_vencimiento);
        return fechaTarea < hoy && !task.completada;
      }),

      // Hoy: Fecha de hoy (TODAS, completadas y sin completar)
      hoy: tasks.filter((task) => {
        const fechaTarea = new Date(task.fecha_vencimiento);
        return fechaTarea >= hoy && fechaTarea < manana;
      }),

      // Próximas: Después de hoy Y sin completar
      proximas: tasks.filter((task) => {
        const fechaTarea = new Date(task.fecha_vencimiento);
        return fechaTarea >= manana && !task.completada;
      }),
    };
  }

  /**
   * Obtiene las tareas clasificadas con la nueva lógica
   * ESTA ES LA FUNCIÓN PRINCIPAL que usarás en el componente
   */
  async getClassifiedTasks(): Promise<ClassifiedTasks> {
    try {
      // Ahora obtenemos TODAS las tareas (no solo las no completadas)
      const allTasks = await this.getAllTasksForClassification();

      // Las clasificamos según las reglas del diseño
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
        .select('completada')  // Solo necesitamos el campo 'completada'
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

  /**
 * Obtiene el conteo de tareas por categoría
 * Útil para mostrar badges con números en la interfaz
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

  /**
   * Obtiene una tarea específica por su ID
   * Solo si pertenece al usuario autenticado
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
        .eq('completada', true) // Solo las completadas
        .order('updated_at', { ascending: false }); // Más recientes primero

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

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      let query = this.supabaseService
        .getClient()
        .from('tareas')
        .select('*')
        .eq('usuario_id', user.id);

      // 🟣 FILTRO POR ESTADO
      if (filters?.estado) {
        query = query.eq(
          'completada',
          filters.estado === 'completada'
        );
      }

      // 🔴 FILTRO POR PRIORIDAD
      if (filters?.prioridad) {
        query = query.eq('prioridad', filters.prioridad);
      }

      // 📅 FILTRO POR FECHA (día exacto)
      if (filters?.fecha) {
        query = query.eq('fecha', filters.fecha);
        // si usas timestamp:
        // query = query.gte('fecha', `${filters.fecha}T00:00:00`)
        //              .lte('fecha', `${filters.fecha}T23:59:59`)
      }

      const { data, error } = await query.order('fecha', { ascending: true });

      if (error) {
        console.error('Error al obtener tareas:', error);
        return [];
      }

      return data as Task[];
    } catch (error) {
      console.error('Error inesperado:', error);
      return [];
    }
  }


}