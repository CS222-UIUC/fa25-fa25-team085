/**
 * Get Tasks
 * Fetches all tasks for a user
 */

import { supabase } from '../src/config/supabase.js';
import type { Task } from '../src/types/database.types.js';

export interface GetTasksResult {
  data: Task[] | null;
  error: { message: string; code?: string } | null;
}

/**
 * Get all tasks for a user
 * @param userId - User ID (UUID)
 * @returns Promise with data and error
 */
export async function getTasks(
  userId: string
): Promise<GetTasksResult> {
  try {

    // Build the query
    const query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    // Execute the query
    const { data, error } = await query;

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
      data: data || [],
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'Failed to get tasks',
        code: undefined,
      },
    };
  }
}

