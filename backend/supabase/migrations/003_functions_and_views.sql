-- Migration: 003_functions_and_views.sql
-- Description: Useful database functions and views for analytics and aggregations

-- View for study session statistics per user
CREATE OR REPLACE VIEW public.user_study_stats AS
SELECT
  user_id,
  COUNT(*) as total_sessions,
  SUM(duration_minutes) as total_minutes_studied,
  AVG(duration_minutes) as avg_session_duration,
  AVG(productivity_rating) as avg_productivity_rating,
  AVG(mood_rating) as avg_mood_rating,
  MAX(start_time) as last_session_date,
  COUNT(CASE WHEN start_time >= NOW() - INTERVAL '7 days' THEN 1 END) as sessions_this_week,
  COUNT(CASE WHEN start_time >= NOW() - INTERVAL '30 days' THEN 1 END) as sessions_this_month
FROM public.study_sessions
WHERE end_time IS NOT NULL
GROUP BY user_id;

-- View for daily study summaries
CREATE OR REPLACE VIEW public.daily_study_summary AS
SELECT
  user_id,
  DATE(start_time) as study_date,
  COUNT(*) as sessions_count,
  SUM(duration_minutes) as total_minutes,
  AVG(productivity_rating) as avg_productivity,
  AVG(mood_rating) as avg_mood,
  array_agg(DISTINCT session_type) as session_types
FROM public.study_sessions
WHERE end_time IS NOT NULL
GROUP BY user_id, DATE(start_time);

-- Function to get user's study streak (consecutive days)
CREATE OR REPLACE FUNCTION get_study_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
BEGIN
  LOOP
    IF EXISTS (
      SELECT 1
      FROM public.study_sessions
      WHERE user_id = p_user_id
        AND DATE(start_time) = check_date
        AND end_time IS NOT NULL
    ) THEN
      streak := streak + 1;
      check_date := check_date - 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate study session duration
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
    NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate duration when session ends
CREATE TRIGGER calculate_duration_trigger
  BEFORE INSERT OR UPDATE ON public.study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_session_duration();

-- Function to get task completion rate for a user
CREATE OR REPLACE FUNCTION get_task_completion_rate(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_tasks
  FROM public.tasks
  WHERE user_id = p_user_id;
  
  IF total_tasks = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO completed_tasks
  FROM public.tasks
  WHERE user_id = p_user_id AND is_completed = TRUE;
  
  RETURN ROUND((completed_tasks::NUMERIC / total_tasks::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

