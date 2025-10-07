/**
 * Study Session Service
 * Handles operations related to study sessions
 */

import { supabase } from '../config/supabase.js';
import type {
  StudySession,
  StudySessionInsert,
  StudySessionUpdate,
  StudySessionTag,
  StudySessionTagInsert,
  UserStudyStats,
  DailyStudySummary,
} from '../types/database.types.js';
import type { ApiResponse, DateRangeFilter } from '../types/common.types.js';

export class StudySessionService {
  /**
   * Create a new study session
   */
  static async createSession(
    sessionData: StudySessionInsert
  ): Promise<ApiResponse<StudySession>> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert(sessionData)
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
        error: { message: error.message || 'Failed to create study session' },
        success: false,
      };
    }
  }

  /**
   * Get a study session by ID
   */
  static async getSession(
    sessionId: string
  ): Promise<ApiResponse<StudySession>> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('id', sessionId)
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
        error: { message: error.message || 'Failed to get study session' },
        success: false,
      };
    }
  }

  /**
   * Update a study session
   */
  static async updateSession(
    sessionId: string,
    updates: StudySessionUpdate
  ): Promise<ApiResponse<StudySession>> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', sessionId)
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
        error: { message: error.message || 'Failed to update study session' },
        success: false,
      };
    }
  }

  /**
   * End a study session (set end_time)
   */
  static async endSession(
    sessionId: string,
    endData?: {
      mood_rating?: number;
      productivity_rating?: number;
      session_notes?: string;
    }
  ): Promise<ApiResponse<StudySession>> {
    try {
      const updates: StudySessionUpdate = {
        end_time: new Date().toISOString(),
        ...endData,
      };

      return await this.updateSession(sessionId, updates);
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to end study session' },
        success: false,
      };
    }
  }

  /**
   * Delete a study session
   */
  static async deleteSession(sessionId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionId);

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
        error: { message: error.message || 'Failed to delete study session' },
        success: false,
      };
    }
  }

  /**
   * Get all study sessions for a user
   */
  static async getUserSessions(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: 'start_time' | 'created_at';
      orderDirection?: 'asc' | 'desc';
      dateRange?: DateRangeFilter;
    }
  ): Promise<ApiResponse<StudySession[]>> {
    try {
      let query = supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId);

      // Apply date range filter
      if (options?.dateRange) {
        query = query
          .gte('start_time', options.dateRange.start_date)
          .lte('start_time', options.dateRange.end_date);
      }

      // Apply ordering
      const orderBy = options?.orderBy || 'start_time';
      const orderDirection = options?.orderDirection || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
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
        error: { message: error.message || 'Failed to get study sessions' },
        success: false,
      };
    }
  }

  /**
   * Get active (ongoing) study session for a user
   */
  static async getActiveSession(
    userId: string
  ): Promise<ApiResponse<StudySession | null>> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .is('end_time', null)
        .order('start_time', { ascending: false })
        .limit(1)
        .maybeSingle();

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
        error: { message: error.message || 'Failed to get active session' },
        success: false,
      };
    }
  }

  /**
   * Get study statistics for a user
   */
  static async getUserStats(
    userId: string
  ): Promise<ApiResponse<UserStudyStats>> {
    try {
      const { data, error } = await supabase
        .from('user_study_stats')
        .select('*')
        .eq('user_id', userId)
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
        error: { message: error.message || 'Failed to get user stats' },
        success: false,
      };
    }
  }

  /**
   * Get daily study summary for a user
   */
  static async getDailySummary(
    userId: string,
    dateRange?: DateRangeFilter
  ): Promise<ApiResponse<DailyStudySummary[]>> {
    try {
      let query = supabase
        .from('daily_study_summary')
        .select('*')
        .eq('user_id', userId)
        .order('study_date', { ascending: false });

      if (dateRange) {
        query = query
          .gte('study_date', dateRange.start_date)
          .lte('study_date', dateRange.end_date);
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
        error: { message: error.message || 'Failed to get daily summary' },
        success: false,
      };
    }
  }

  /**
   * Get study streak for a user
   */
  static async getStudyStreak(userId: string): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase.rpc('get_study_streak', {
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
        error: { message: error.message || 'Failed to get study streak' },
        success: false,
      };
    }
  }

  /**
   * Add tags to a study session
   */
  static async addSessionTags(
    sessionId: string,
    tags: string[]
  ): Promise<ApiResponse<StudySessionTag[]>> {
    try {
      const tagInserts: StudySessionTagInsert[] = tags.map((tag) => ({
        session_id: sessionId,
        tag: tag.toLowerCase().trim(),
      }));

      const { data, error } = await supabase
        .from('study_session_tags')
        .insert(tagInserts)
        .select();

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
        error: { message: error.message || 'Failed to add tags' },
        success: false,
      };
    }
  }

  /**
   * Get tags for a study session
   */
  static async getSessionTags(
    sessionId: string
  ): Promise<ApiResponse<StudySessionTag[]>> {
    try {
      const { data, error } = await supabase
        .from('study_session_tags')
        .select('*')
        .eq('session_id', sessionId);

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
        error: { message: error.message || 'Failed to get tags' },
        success: false,
      };
    }
  }

  /**
   * Remove a tag from a study session
   */
  static async removeSessionTag(
    sessionId: string,
    tag: string
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('study_session_tags')
        .delete()
        .eq('session_id', sessionId)
        .eq('tag', tag.toLowerCase().trim());

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
        error: { message: error.message || 'Failed to remove tag' },
        success: false,
      };
    }
  }

  /**
   * Get sessions by tag
   */
  static async getSessionsByTag(
    userId: string,
    tag: string
  ): Promise<ApiResponse<StudySession[]>> {
    try {
      // First get all session IDs with the tag
      const { data: tagData, error: tagError } = await supabase
        .from('study_session_tags')
        .select('session_id')
        .eq('tag', tag.toLowerCase().trim());

      if (tagError) {
        return {
          data: null,
          error: { message: tagError.message, code: tagError.code },
          success: false,
        };
      }

      if (!tagData || tagData.length === 0) {
        return {
          data: [],
          error: null,
          success: true,
        };
      }

      const sessionIds = tagData.map((t) => t.session_id);

      // Get all sessions with those IDs
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .in('id', sessionIds)
        .order('start_time', { ascending: false });

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
        error: { message: error.message || 'Failed to get sessions by tag' },
        success: false,
      };
    }
  }
}

