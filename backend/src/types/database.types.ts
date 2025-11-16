/**
 * Database entity type definitions
 * These interfaces match the PostgreSQL database schema
 */

// User Profile
export interface UserProfile {
  id: string; // UUID
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  preferences: Record<string, any>;
}

export interface UserProfileInsert {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}

export interface UserProfileUpdate {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}

// Study Session
export type SessionType = 'pomodoro' | 'countdown' | 'stopwatch' | 'custom';

export interface StudySession {
  id: string; // UUID
  user_id: string; // UUID
  session_type: SessionType;
  start_time: string; // ISO timestamp
  end_time: string | null; // ISO timestamp
  duration_minutes: number | null;
  target_duration_minutes: number | null;
  session_notes: string | null;
  mood_rating: number | null; // 1-5
  productivity_rating: number | null; // 1-5
  ai_feedback: string | null;
  ai_feedback_generated_at: string | null; // ISO timestamp
  google_calendar_event_id: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface StudySessionInsert {
  user_id: string;
  session_type: SessionType;
  start_time: string;
  end_time?: string | null;
  target_duration_minutes?: number | null;
  session_notes?: string | null;
  mood_rating?: number | null;
  productivity_rating?: number | null;
}

export interface StudySessionUpdate {
  end_time?: string | null;
  session_notes?: string | null;
  mood_rating?: number | null;
  productivity_rating?: number | null;
  ai_feedback?: string | null;
  ai_feedback_generated_at?: string | null;
  google_calendar_event_id?: string | null;
}

// Task
export type TaskPriority = 0 | 1 | 2 | 3; // none, low, medium, high

export interface Task {
  id: string; // UUID
  user_id: string; // UUID
  session_id: string | null; // UUID
  title: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null; // ISO timestamp
  priority: TaskPriority;
  due_date: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  order_index: number;
}

export interface TaskInsert {
  user_id: string;
  session_id?: string | null;
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
  order_index?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
  priority?: TaskPriority;
  due_date?: string | null;
  order_index?: number;
  session_id?: string | null;
}

// Flashcard Deck
export interface FlashcardDeck {
  id: string; // UUID
  user_id: string; // UUID
  name: string;
  description: string | null;
  color: string; // hex color code
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface FlashcardDeckInsert {
  user_id: string;
  name: string;
  description?: string | null;
  color?: string;
}

export interface FlashcardDeckUpdate {
  name?: string;
  description?: string | null;
  color?: string;
}

// Flashcard
export interface Flashcard {
  id: string; // UUID
  deck_id: string; // UUID
  user_id: string; // UUID
  front_content: string;
  back_content: string;
  order_index: number;
  times_reviewed: number;
  times_correct: number;
  last_reviewed_at: string | null; // ISO timestamp
  next_review_at: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface FlashcardInsert {
  deck_id: string;
  user_id: string;
  front_content: string;
  back_content: string;
  order_index?: number;
}

export interface FlashcardUpdate {
  front_content?: string;
  back_content?: string;
  order_index?: number;
  times_reviewed?: number;
  times_correct?: number;
  last_reviewed_at?: string | null;
  next_review_at?: string | null;
}

// Study Session Tag
export interface StudySessionTag {
  id: string; // UUID
  session_id: string; // UUID
  tag: string;
  created_at: string; // ISO timestamp
}

export interface StudySessionTagInsert {
  session_id: string;
  tag: string;
}

// Analytics and aggregate types
export interface UserStudyStats {
  user_id: string;
  total_sessions: number;
  total_minutes_studied: number;
  avg_session_duration: number;
  avg_productivity_rating: number;
  avg_mood_rating: number;
  last_session_date: string;
  sessions_this_week: number;
  sessions_this_month: number;
}

export interface DailyStudySummary {
  user_id: string;
  study_date: string;
  sessions_count: number;
  total_minutes: number;
  avg_productivity: number;
  avg_mood: number;
  session_types: SessionType[];
}

