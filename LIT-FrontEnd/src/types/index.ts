// Types for backend integration

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  text: string;
  done: boolean;
  session_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  user_id: string;
  front: string;
  back: string;
  session_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  tasks_completed: number;
  tasks_total: number;
  cards_added: number;
  notes: string | null;
  secondary_timer_mode: 'stopwatch' | 'countdown' | 'pomodoro' | 'custom' | null;
  secondary_timer_work_min?: number | null;
  secondary_timer_break_min?: number | null;
  ai_feedback: string | null;
  score: number | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_seconds: number;
  total_sessions: number;
  completion_rate: number;
  streak_days: number;
  tasks_completed: number;
  tasks_total: number;
  cards_created: number;
  by_day: Array<{
    date: string;
    seconds: number;
    sessions: number;
  }>;
}

export interface SessionDraft {
  tasks: Array<{ id: string; text: string; done: boolean }>;
  cards: Array<{ front: string; back: string }>;
  notes: string;
  started_at: string | null;
  duration_seconds: number;
  secondary_timer: {
    mode: 'stopwatch' | 'countdown' | 'pomodoro' | 'custom';
    work_min?: number;
    break_min?: number;
    countdown_min?: number;
  };
}

