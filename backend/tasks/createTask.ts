/**
 * Create Task
 * Creates a new task for a user
 */

import { supabase } from '../src/config/supabase.js';
import type { Task } from '../src/types/database.types.js';

export interface CreateTaskResult {
  data: Task | null;
  error: { message: string; code?: string } | null;
}

/**
 * Create a new task for a user
 * @param userId - User ID (UUID)
 * @param title - Task title
 * @returns Promise with data and error
 */
export async function createTask(
  userId: string,
  title: string
): Promise<CreateTaskResult> {
  try {

    // Validate title is not empty
    if (!title || title.trim().length === 0) {
      return {
        data: null,
        error: {
          message: 'Task title cannot be empty',
          code: 'VALIDATION_ERROR',
        },
      };
    }

    // Prepare the task data
    const taskData = {
      user_id: userId,
      title: title.trim(),
      description: null,
      priority: 0, // Default priority
      due_date: null,
      session_id: null,
      is_completed: false,
      order_index: 0, // Default order index
    };

    // Insert into tasks table
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code || undefined,
        },
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'Failed to create task',
        code: undefined,
      },
    };
  }
}

