/**
 * Task Service
 * Handles operations related to user tasks
 */

import { supabase } from '../config/supabase.js';
import type {
  Task,
  TaskInsert,
  TaskUpdate,
  TaskPriority,
} from '../types/database.types.js';
import type { ApiResponse } from '../types/common.types.js';

export class TaskService {
  /**
   * Create a new task
   */
  static async createTask(taskData: TaskInsert): Promise<ApiResponse<Task>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to create task' },
        success: false,
      };
    }
  }

  /**
   * Get a task by ID
   */
  static async getTask(taskId: string): Promise<ApiResponse<Task>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get task' },
        success: false,
      };
    }
  }

  /**
   * Update a task
   */
  static async updateTask(
    taskId: string,
    updates: TaskUpdate
  ): Promise<ApiResponse<Task>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to update task' },
        success: false,
      };
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to delete task' },
        success: false,
      };
    }
  }

  /**
   * Get all tasks for a user
   */
  static async getUserTasks(
    userId: string,
    options?: {
      completed?: boolean;
      sessionId?: string;
      limit?: number;
    }
  ): Promise<ApiResponse<Task[]>> {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      // Filter by completion status
      if (options?.completed !== undefined) {
        query = query.eq('is_completed', options.completed);
      }

      // Filter by session
      if (options?.sessionId) {
        query = query.eq('session_id', options.sessionId);
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data: data || [],
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get tasks' },
        success: false,
      };
    }
  }

  /**
   * Toggle task completion status
   */
  static async toggleTaskCompletion(
    taskId: string
  ): Promise<ApiResponse<Task>> {
    try {
      // First get the current task
      const { data: currentTask, error: getError } = await supabase
        .from('tasks')
        .select('is_completed')
        .eq('id', taskId)
        .single();

      if (getError) {
        return {
          data: null,
          error: { message: getError.message, code: getError.code },
          success: false,
        };
      }

      // Toggle the completion status
      const { data, error } = await supabase
        .from('tasks')
        .update({ is_completed: !currentTask.is_completed })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to toggle task completion' },
        success: false,
      };
    }
  }

  /**
   * Get task completion rate for a user
   */
  static async getTaskCompletionRate(
    userId: string
  ): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase.rpc('get_task_completion_rate', {
        p_user_id: userId,
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data: data || 0,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get completion rate' },
        success: false,
      };
    }
  }

  /**
   * Reorder tasks (update order_index for multiple tasks)
   */
  static async reorderTasks(
    taskUpdates: Array<{ id: string; order_index: number }>
  ): Promise<ApiResponse<null>> {
    try {
      // Update each task's order_index
      const updates = taskUpdates.map(({ id, order_index }) =>
        supabase.from('tasks').update({ order_index }).eq('id', id)
      );

      await Promise.all(updates);

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to reorder tasks' },
        success: false,
      };
    }
  }
}

