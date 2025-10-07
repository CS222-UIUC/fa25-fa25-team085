-- Migration: 002_row_level_security.sql
-- Description: Set up Row Level Security (RLS) policies for data protection
-- Ensures users can only access their own data

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_session_tags ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Study Sessions Policies
-- Users can view their own study sessions
CREATE POLICY "Users can view own study sessions"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own study sessions
CREATE POLICY "Users can insert own study sessions"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own study sessions
CREATE POLICY "Users can update own study sessions"
  ON public.study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own study sessions
CREATE POLICY "Users can delete own study sessions"
  ON public.study_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Tasks Policies
-- Users can view their own tasks
CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own tasks
CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own tasks
CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own tasks
CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Flashcard Decks Policies
-- Users can view their own flashcard decks
CREATE POLICY "Users can view own flashcard decks"
  ON public.flashcard_decks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own flashcard decks
CREATE POLICY "Users can insert own flashcard decks"
  ON public.flashcard_decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own flashcard decks
CREATE POLICY "Users can update own flashcard decks"
  ON public.flashcard_decks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own flashcard decks
CREATE POLICY "Users can delete own flashcard decks"
  ON public.flashcard_decks FOR DELETE
  USING (auth.uid() = user_id);

-- Flashcards Policies
-- Users can view their own flashcards
CREATE POLICY "Users can view own flashcards"
  ON public.flashcards FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own flashcards
CREATE POLICY "Users can insert own flashcards"
  ON public.flashcards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own flashcards
CREATE POLICY "Users can update own flashcards"
  ON public.flashcards FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own flashcards
CREATE POLICY "Users can delete own flashcards"
  ON public.flashcards FOR DELETE
  USING (auth.uid() = user_id);

-- Study Session Tags Policies
-- Users can view tags for their own study sessions
CREATE POLICY "Users can view own study session tags"
  ON public.study_session_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.study_sessions
      WHERE id = study_session_tags.session_id
      AND user_id = auth.uid()
    )
  );

-- Users can insert tags for their own study sessions
CREATE POLICY "Users can insert own study session tags"
  ON public.study_session_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.study_sessions
      WHERE id = study_session_tags.session_id
      AND user_id = auth.uid()
    )
  );

-- Users can delete tags from their own study sessions
CREATE POLICY "Users can delete own study session tags"
  ON public.study_session_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.study_sessions
      WHERE id = study_session_tags.session_id
      AND user_id = auth.uid()
    )
  );

