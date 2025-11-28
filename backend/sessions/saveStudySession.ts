/**
 * Save Study Session
 * Stores a completed study session in Supabase
 */

import { supabase } from '../src/config/supabase.js';
import type { StudySession } from '../src/types/database.types.js';

export interface SaveStudySessionResult {
  data: StudySession | null;
  error: { message: string; code?: string } | null;
}

/**
 * Save a completed study session to the database
 * @param userId - User ID (UUID)
 * @param duration - Duration in minutes
 * @param startTime - Start time as ISO timestamp
 * @param endTime - End time as ISO timestamp
 * @param interruptions - Number of interruptions (optional)
 * @param notes - Session notes (optional)
 * @returns Promise with data and error
 */
export async function saveStudySession(
  userId: string,
  duration: number,
  startTime: string,
  endTime: string,
  interruptions?: number,
  notes?: string
): Promise<SaveStudySessionResult> {
  try {

    // Combine notes and interruptions into session_notes
    let sessionNotes = notes || '';
    if (interruptions !== undefined && interruptions > 0) {
      const interruptionNote = `Interruptions: ${interruptions}`;
      sessionNotes = sessionNotes
        ? `${sessionNotes}\n${interruptionNote}`
        : interruptionNote;
    }

    // Prepare the session data
    const sessionData = {
      user_id: userId,
      session_type: 'custom' as const, // Default session type
      start_time: startTime,
      end_time: endTime,
      duration_minutes: Math.round(duration), // Round to nearest minute
      session_notes: sessionNotes || null,
    };

    // Insert into study_sessions table
    const { data, error } = await supabase
      .from('study_sessions')
      .insert(sessionData)
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
        message: error.message || 'Failed to save study session',
        code: undefined,
      },
    };
  }
}

