import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Subject } from 'rxjs';
import {
  Habit,
  CreateHabitDto,
  UpdateHabitDto,
  HabitFrequency,
  HabitCompleted,
  HabitConsistencyMap,
  HabitStats,
  HabitsSummary,
  HabitHistoryFilters,
  DEFAULT_HABIT_COLORS,
  DEFAULT_HABIT_ICONS,
} from '../models/habits.model';

@Injectable({
  providedIn: 'root',
})
export class HabitsService {

  private _refreshNeeded = new Subject<void>();

  get refreshNeeded() {
    return this._refreshNeeded.asObservable();
  }

  notifyHabitUpdate() {
    this._refreshNeeded.next();
  }

  constructor(private supabaseService: SupabaseService) { }

  // ============================================
  // CRUD BÁSICO
  // ============================================

  /**
   * Crea un nuevo hábito
   */
  async createHabit(dto: CreateHabitDto): Promise<Habit | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .insert({
          nombre: dto.nombre,
          icono: dto.icono || DEFAULT_HABIT_ICONS[0],
          color: dto.color || DEFAULT_HABIT_COLORS[0],
          frecuencia: dto.frecuencia || 'diaria',
          usuario_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear hábito:', error);
        return null;
      }

      return data as Habit;
    } catch (error) {
      console.error('Error inesperado al crear hábito:', error);
      return null;
    }
  }

  /**
   * Actualiza un hábito existente
   */
  async updateHabit(id: string, dto: UpdateHabitDto): Promise<Habit | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .update({
          ...dto
        })
        .eq('id', id)
        .eq('usuario_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar hábito:', error);
        return null;
      }

      return data as Habit;
    } catch (error) {
      console.error('Error inesperado al actualizar hábito:', error);
      return null;
    }
  }

  /**
   * Elimina un hábito
   */
  async deleteHabit(id: string): Promise<Habit | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .delete()
        .eq('id', id)
        .eq('usuario_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error al eliminar hábito:', error);
        return null;
      }

      return data as Habit;
    } catch (error) {
      console.error('Error inesperado al eliminar hábito:', error);
      return null;
    }
  }

  /**
   * Obtiene un hábito específico por su ID
   */
  async getHabitById(id: string): Promise<Habit | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', user.id)
        .single();

      if (error) {
        console.error('Error al obtener hábito por ID:', error);
        return null;
      }

      return data as Habit;
    } catch (error) {
      console.error('Error inesperado al obtener hábito por ID:', error);
      return null;
    }
  }

  // ============================================
  // OBTENER HÁBITOS (QUERIES)
  // ============================================

  /**
   * Obtiene todos los hábitos del usuario
   */
  async getAllHabits(): Promise<Habit[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('activo', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al obtener hábitos:', error);
        return [];
      }

      return (data as Habit[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener hábitos:', error);
      return [];
    }
  }

  /**
   * Obtiene hábitos filtrados por frecuencia
   */
  async getHabitsByFrequency(frequency: HabitFrequency): Promise<Habit[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('activo', true)
        .eq('frecuencia', frequency)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al obtener hábitos por frecuencia:', error);
        return [];
      }

      return (data as Habit[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener hábitos por frecuencia:', error);
      return [];
    }
  }

  /**
   * Obtiene solo los hábitos completados (estado actual)
   */
  async getCompletedHabits(): Promise<Habit[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('activo', true)
        .eq('completado', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al obtener hábitos completados:', error);
        return [];
      }

      return (data as Habit[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener hábitos completados:', error);
      return [];
    }
  }

  /**
   * Obtiene solo los hábitos pendientes (no completados)
   */
  async getPendingHabits(): Promise<Habit[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('activo', true)
        .eq('completado', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al obtener hábitos pendientes:', error);
        return [];
      }

      return (data as Habit[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener hábitos pendientes:', error);
      return [];
    }
  }

  // ============================================
  // MARCAR COMPLETADO/DESMARCAR
  // ============================================

  /**
   * Marca un hábito como completado HOY
   */
  async markHabitAsCompleted(habitId: string): Promise<boolean> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return false;
      }

      const today = new Date().toISOString().split('T')[0];

      // Insertar en habitos_completados (con constraint de unique no duplicará)
      const { error: insertError } = await this.supabaseService
        .getClient()
        .from('habitos_completados')
        .insert({
          habito_id: habitId,
          usuario_id: user.id,
          fecha_completado: today,
        });

      if (insertError) {
        // Si el error es por duplicado (23505), es OK, ya está marcado
        if (insertError.code === '23505') {
          console.log('Hábito ya estaba marcado como completado hoy');
          return true;
        }
        console.error('Error al marcar hábito como completado:', insertError);
        return false;
      }

      // El trigger en la BD ya actualiza las rachas y el campo 'completado'
      return true;
    } catch (error) {
      console.error('Error inesperado al marcar hábito:', error);
      return false;
    }
  }

  /**
   * Desmarca un hábito como completado HOY
   */
  async unmarkHabitAsCompleted(habitId: string): Promise<boolean> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return false;
      }

      const today = new Date().toISOString().split('T')[0];

      // Eliminar el registro de hoy
      const { error: deleteError } = await this.supabaseService
        .getClient()
        .from('habitos_completados')
        .delete()
        .eq('habito_id', habitId)
        .eq('usuario_id', user.id)
        .eq('fecha_completado', today);

      if (deleteError) {
        console.error('Error al desmarcar hábito:', deleteError);
        return false;
      }

      // Actualizar el estado 'completado' a false manualmente
      await this.supabaseService
        .getClient()
        .from('habitos')
        .update({ completado: false })
        .eq('id', habitId)
        .eq('usuario_id', user.id);

      // Recalcular la racha
      await this.calculateCurrentStreak(habitId);

      return true;
    } catch (error) {
      console.error('Error inesperado al desmarcar hábito:', error);
      return false;
    }
  }

  /**
   * Alterna el estado de completado de un hábito
   */
  async toggleHabitCompletion(habitId: string): Promise<boolean> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return false;
      }

      // Obtener el hábito actual
      const habit = await this.getHabitById(habitId);

      if (!habit) {
        console.error('Hábito no encontrado');
        return false;
      }

      // Toggle: si está completado → desmarcar, si no → marcar
      if (habit.completado) {
        return await this.unmarkHabitAsCompleted(habitId);
      } else {
        return await this.markHabitAsCompleted(habitId);
      }
    } catch (error) {
      console.error('Error inesperado al alternar completado:', error);
      return false;
    }
  }

  // ============================================
  // HISTORIAL Y MAPA DE CONSTANCIA
  // ============================================

  /**
   * Obtiene el historial de un hábito específico
   */
  async getHabitHistory(
    habitId: string,
    filters?: HabitHistoryFilters
  ): Promise<HabitCompleted[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      let query = this.supabaseService
        .getClient()
        .from('habitos_completados')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('habito_id', habitId);

      // Aplicar filtros
      if (filters?.fecha_inicio) {
        query = query.gte('fecha_completado', filters.fecha_inicio);
      }
      if (filters?.fecha_fin) {
        query = query.lte('fecha_completado', filters.fecha_fin);
      }
      if (filters?.ano) {
        const startOfYear = `${filters.ano}-01-01`;
        const endOfYear = `${filters.ano}-12-31`;
        query = query.gte('fecha_completado', startOfYear).lte('fecha_completado', endOfYear);
      }
      if (filters?.mes && filters?.ano) {
        const monthStr = filters.mes.toString().padStart(2, '0');
        const startOfMonth = `${filters.ano}-${monthStr}-01`;
        const lastDay = new Date(filters.ano, filters.mes, 0).getDate();
        const endOfMonth = `${filters.ano}-${monthStr}-${lastDay}`;
        query = query.gte('fecha_completado', startOfMonth).lte('fecha_completado', endOfMonth);
      }

      query = query.order('fecha_completado', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error al obtener historial del hábito:', error);
        return [];
      }

      return (data as HabitCompleted[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener historial:', error);
      return [];
    }
  }

  /**
   * Obtiene el historial de todos los hábitos del usuario
   */
  async getAllHabitsHistory(filters?: HabitHistoryFilters): Promise<HabitCompleted[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      let query = this.supabaseService
        .getClient()
        .from('habitos_completados')
        .select('*')
        .eq('usuario_id', user.id);

      // Aplicar filtros (igual que en getHabitHistory)
      if (filters?.habito_id) {
        query = query.eq('habito_id', filters.habito_id);
      }
      if (filters?.fecha_inicio) {
        query = query.gte('fecha_completado', filters.fecha_inicio);
      }
      if (filters?.fecha_fin) {
        query = query.lte('fecha_completado', filters.fecha_fin);
      }
      if (filters?.ano) {
        const startOfYear = `${filters.ano}-01-01`;
        const endOfYear = `${filters.ano}-12-31`;
        query = query.gte('fecha_completado', startOfYear).lte('fecha_completado', endOfYear);
      }
      if (filters?.mes && filters?.ano) {
        const monthStr = filters.mes.toString().padStart(2, '0');
        const startOfMonth = `${filters.ano}-${monthStr}-01`;
        const lastDay = new Date(filters.ano, filters.mes, 0).getDate();
        const endOfMonth = `${filters.ano}-${monthStr}-${lastDay}`;
        query = query.gte('fecha_completado', startOfMonth).lte('fecha_completado', endOfMonth);
      }

      query = query.order('fecha_completado', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error al obtener historial de todos los hábitos:', error);
        return [];
      }

      return (data as HabitCompleted[]) || [];
    } catch (error) {
      console.error('Error inesperado al obtener historial completo:', error);
      return [];
    }
  }

  /**
   * Obtiene el mapa de constancia anual (para el calendario tipo GitHub)
   */
  async getYearConsistencyMap(year: number): Promise<HabitConsistencyMap[]> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return [];
      }

      const startOfYear = `${year}-01-01`;
      const endOfYear = `${year}-12-31`;

      const { data, error } = await this.supabaseService
        .getClient()
        .from('habitos_completados')
        .select('fecha_completado')
        .eq('usuario_id', user.id)
        .gte('fecha_completado', startOfYear)
        .lte('fecha_completado', endOfYear);

      if (error) {
        console.error('Error al obtener mapa de constancia:', error);
        return [];
      }

      // Agrupar por fecha y contar
      const groupedByDate = (data as HabitCompleted[]).reduce((acc, item) => {
        const fecha = item.fecha_completado;
        if (!acc[fecha]) {
          acc[fecha] = 0;
        }
        acc[fecha]++;
        return acc;
      }, {} as Record<string, number>);

      // Convertir a array de HabitConsistencyMap
      const result: HabitConsistencyMap[] = Object.entries(groupedByDate).map(
        ([fecha, total]) => ({
          fecha,
          total_completados: total,
        })
      );

      return result.sort((a, b) => a.fecha.localeCompare(b.fecha));
    } catch (error) {
      console.error('Error inesperado al obtener mapa de constancia:', error);
      return [];
    }
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  /**
   * Obtiene estadísticas de un hábito específico
   */
  async getHabitStats(habitId: string): Promise<HabitStats | null> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return null;
      }

      // Obtener el hábito
      const habit = await this.getHabitById(habitId);
      if (!habit) {
        console.error('Hábito no encontrado');
        return null;
      }

      // Obtener historial completo
      const history = await this.getHabitHistory(habitId);

      // Calcular estadísticas
      const totalDiasCompletados = history.length;

      // Último día completado
      const ultimoCompletado = history.length > 0 ? history[0].fecha_completado : null;

      // Calcular porcentaje de cumplimiento
      const createdDate = new Date(habit.created_at);
      const today = new Date();
      const diasDesdeCreacion = Math.floor(
        (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      // Días esperados según la frecuencia
      let diasEsperados = diasDesdeCreacion;
      if (habit.frecuencia === 'semanal') {
        diasEsperados = Math.floor(diasDesdeCreacion / 7);
      } else if (habit.frecuencia === 'mensual') {
        diasEsperados = Math.floor(diasDesdeCreacion / 30);
      }

      const porcentajeCumplimiento = diasEsperados > 0
        ? Math.round((totalDiasCompletados / diasEsperados) * 100)
        : 0;

      return {
        habito_id: habit.id,
        nombre: habit.nombre,
        total_dias_completados: totalDiasCompletados,
        racha_actual: habit.racha_actual,
        racha_maxima: habit.racha_maxima,
        porcentaje_cumplimiento: porcentajeCumplimiento,
        ultimo_completado: ultimoCompletado,
      };
    } catch (error) {
      console.error('Error inesperado al obtener estadísticas del hábito:', error);
      return null;
    }
  }

  /**
   * Obtiene resumen general de todos los hábitos del usuario
   */
  async getHabitsSummary(): Promise<HabitsSummary> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return {
          total_habitos: 0,
          habitos_completados_hoy: 0,
          racha_promedio: 0,
          mejor_racha: 0,
          dias_activo: 0,
        };
      }

      // Obtener todos los hábitos
      const allHabits = await this.getAllHabits();
      const totalHabitos = allHabits.length;

      // Contar hábitos completados hoy
      const habitosCompletadosHoy = allHabits.filter(h => h.completado).length;

      // Calcular racha promedio
      const rachaPromedio = totalHabitos > 0
        ? Math.round(
          allHabits.reduce((sum, h) => sum + h.racha_actual, 0) / totalHabitos
        )
        : 0;

      // Mejor racha de todos los hábitos
      const mejorRacha = allHabits.length > 0
        ? Math.max(...allHabits.map(h => h.racha_maxima))
        : 0;

      // Días activo (desde que creó su primer hábito)
      let diasActivo = 0;
      if (allHabits.length > 0) {
        const primeraFecha = new Date(
          Math.min(...allHabits.map(h => new Date(h.created_at).getTime()))
        );
        const hoy = new Date();
        diasActivo = Math.floor(
          (hoy.getTime() - primeraFecha.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      }

      return {
        total_habitos: totalHabitos,
        habitos_completados_hoy: habitosCompletadosHoy,
        racha_promedio: rachaPromedio,
        mejor_racha: mejorRacha,
        dias_activo: diasActivo,
      };
    } catch (error) {
      console.error('Error inesperado al obtener resumen de hábitos:', error);
      return {
        total_habitos: 0,
        habitos_completados_hoy: 0,
        racha_promedio: 0,
        mejor_racha: 0,
        dias_activo: 0,
      };
    }
  }

  /**
   * Calcula la racha actual de un hábito
   * (Por si necesitas recalcular manualmente)
   */
  async calculateCurrentStreak(habitId: string): Promise<number> {
    try {
      const user = this.supabaseService.currentUserValue;

      if (!user) {
        console.error('No hay usuario autenticado');
        return 0;
      }

      const habit = await this.getHabitById(habitId);
      if (!habit) return 0;

      // Llamar a la función SQL
      const { data, error } = await this.supabaseService
        .getClient()
        .rpc('calcular_racha_habito', {
          p_habito_id: habitId,
          p_frecuencia: habit.frecuencia,
        });

      if (error) {
        console.error('Error al calcular racha:', error);
        return 0;
      }

      const racha = data as number;

      // Actualizar la racha en el hábito
      await this.supabaseService
        .getClient()
        .from('habitos')
        .update({
          racha_actual: racha,
          racha_maxima: Math.max(habit.racha_maxima, racha),
        })
        .eq('id', habitId)
        .eq('usuario_id', user.id);

      return racha;
    } catch (error) {
      console.error('Error inesperado al calcular racha:', error);
      return 0;
    }
  }

  // ============================================
  // RESETEO Y MANTENIMIENTO
  // ============================================

  /**
   * Resetea los hábitos según su frecuencia
   * Debe ejecutarse al iniciar la app o diariamente
   */
  async resetHabits(): Promise<boolean> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .rpc('resetear_habitos_completados');

      if (error) {
        console.error('Error al resetear hábitos:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error inesperado al resetear hábitos:', error);
      return false;
    }
  }

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Obtiene los hábitos que el usuario debe hacer HOY
   * (Diarios + Semanales si es lunes + Mensuales si es día 1)
   */
  async getHabitsForToday(): Promise<Habit[]> {
    try {
      const allHabits = await this.getAllHabits();
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes
      const dayOfMonth = today.getDate();

      const habitsForToday = allHabits.filter(habit => {
        if (habit.frecuencia === 'diaria') return true;
        if (habit.frecuencia === 'semanal' && dayOfWeek === 1) return true; // Lunes
        if (habit.frecuencia === 'mensual' && dayOfMonth === 1) return true; // Día 1
        return false;
      });

      return habitsForToday;
    } catch (error) {
      console.error('Error inesperado al obtener hábitos para hoy:', error);
      return [];
    }
  }

  /**
   * Calcula el porcentaje de cumplimiento en un período
   */
  async getCompletionPercentage(
    habitId: string,
    period: 'week' | 'month' | 'year'
  ): Promise<number> {
    try {
      const habit = await this.getHabitById(habitId);
      if (!habit) return 0;

      const today = new Date();
      let startDate: Date;

      // Determinar fecha de inicio según el período
      switch (period) {
        case 'week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date(today);
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      const startDateStr = startDate.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      // Obtener historial del período
      const history = await this.getHabitHistory(habitId, {
        fecha_inicio: startDateStr,
        fecha_fin: todayStr,
      });

      const diasCompletados = history.length;

      // Calcular días esperados según la frecuencia
      const diasEnPeriodo = Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      let diasEsperados = diasEnPeriodo;
      if (habit.frecuencia === 'semanal') {
        diasEsperados = Math.floor(diasEnPeriodo / 7);
      } else if (habit.frecuencia === 'mensual') {
        diasEsperados = Math.floor(diasEnPeriodo / 30);
      }

      return diasEsperados > 0
        ? Math.round((diasCompletados / diasEsperados) * 100)
        : 0;
    } catch (error) {
      console.error('Error inesperado al calcular porcentaje de cumplimiento:', error);
      return 0;
    }
  }
}