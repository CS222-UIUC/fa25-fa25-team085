import { useEffect, useState } from 'react';
import DateFilter from '../components/DateFilter';
import Calendar from '../components/Calendar';
import Box from '@mui/material/Box';
import { Grid, Paper, Typography, Stack, CircularProgress } from '@mui/material';
import Plate from '../components/Plate';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { StudySession, DashboardStats } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Dashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(7, 'day'), dayjs()]);
  const [allSessions, setAllSessions] = useState<StudySession[]>([]); // All sessions for calendar
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all sessions on mount (for calendar)
  useEffect(() => {
    if (user) {
      loadAllSessions();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Initialize stats immediately when component mounts
  useEffect(() => {
    if (user && dateRange[0] && dateRange[1]) {
      // Initialize with empty stats first
      if (!stats) {
        setStats({
          total_seconds: 0,
          total_sessions: 0,
          completion_rate: 0,
          streak_days: 0,
          tasks_completed: 0,
          tasks_total: 0,
          cards_created: 0,
          by_day: [],
        });
      }
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load filtered data when date range changes or sessions are loaded
  useEffect(() => {
    if (user && dateRange[0] && dateRange[1] && allSessions.length >= 0) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, allSessions]);

  const loadAllSessions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // TODO: Replace with actual Supabase queries
      const result = await supabase.from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });
      
      const { data, error } = result || { data: [], error: null };
      
      if (error) {
        console.error('Error loading sessions:', error);
        setAllSessions([]);
      } else {
        // Ensure data is always an array
        const sessions = Array.isArray(data) ? data : [];
        setAllSessions(sessions as StudySession[]);
      }
    } catch (error) {
      console.error('Error loading all sessions:', error);
      setAllSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = () => {
    if (!user || !dateRange[0] || !dateRange[1]) {
      // Set empty stats if no date range
      setStats({
        total_seconds: 0,
        total_sessions: 0,
        completion_rate: 0,
        streak_days: 0,
        tasks_completed: 0,
        tasks_total: 0,
        cards_created: 0,
        by_day: [],
      });
      return;
    }

    try {
      // Filter all sessions by date range
      const startDate = dayjs(dateRange[0]!);
      const endDate = dayjs(dateRange[1]!);
      const filteredSessions = (allSessions || []).filter((s: StudySession) => {
        if (!s || !s.started_at) return false;
        try {
          const sessionDate = dayjs(s.started_at);
          if (!sessionDate.isValid() || !startDate.isValid() || !endDate.isValid()) return false;
          return sessionDate.isSameOrAfter(startDate, 'day') && sessionDate.isSameOrBefore(endDate, 'day');
        } catch (e) {
          console.error('Error parsing session date:', e, s);
          return false;
        }
      });

      // Calculate stats using filteredSessions
      const totalSeconds = filteredSessions.reduce((sum, s) => sum + (s?.duration_seconds || 0), 0);
      const totalSessions = filteredSessions.length;
      const completedTasks = filteredSessions.reduce((sum, s) => sum + (s?.tasks_completed || 0), 0);
      const totalTasks = filteredSessions.reduce((sum, s) => sum + (s?.tasks_total || 0), 0);
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      const cardsCreated = filteredSessions.reduce((sum, s) => sum + (s?.cards_added || 0), 0);

      // Calculate streak using all sessions (not just filtered)
      const streakDays = calculateStreak(allSessions);

      // Group by day
      const byDay = filteredSessions.reduce((acc, session) => {
        if (!session || !session.started_at) return acc;
        try {
          const date = dayjs(session.started_at).format('YYYY-MM-DD');
          if (!acc[date]) {
            acc[date] = { date, seconds: 0, sessions: 0 };
          }
          acc[date].seconds += (session.duration_seconds || 0);
          acc[date].sessions += 1;
        } catch (e) {
          console.error('Error processing session for byDay:', e, session);
        }
        return acc;
      }, {} as Record<string, { date: string; seconds: number; sessions: number }>);

      setStats({
        total_seconds: totalSeconds,
        total_sessions: totalSessions,
        completion_rate: completionRate,
        streak_days: streakDays,
        tasks_completed: completedTasks,
        tasks_total: totalTasks,
        cards_created: cardsCreated,
        by_day: Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set empty stats on error
      setStats({
        total_seconds: 0,
        total_sessions: 0,
        completion_rate: 0,
        streak_days: 0,
        tasks_completed: 0,
        tasks_total: 0,
        cards_created: 0,
        by_day: [],
      });
    }
  };

  const calculateStreak = (sessions: StudySession[]): number => {
    if (!sessions || sessions.length === 0) return 0;
    try {
      const dates = new Set(
        sessions
          .filter(s => s && s.started_at)
          .map(s => {
            try {
              return dayjs(s.started_at).format('YYYY-MM-DD');
            } catch (e) {
              return null;
            }
          })
          .filter((d): d is string => d !== null)
      );
      let streak = 0;
      let currentDate = dayjs().startOf('day');
      while (dates.has(currentDate.format('YYYY-MM-DD'))) {
        streak++;
        currentDate = currentDate.subtract(1, 'day');
      }
      return streak;
    } catch (e) {
      console.error('Error calculating streak:', e);
      return 0;
    }
  };

  const handleDateRangeChange = (range: [Dayjs | null, Dayjs | null]) => {
    setDateRange(range);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ textAlign: 'left', mb: 2, fontWeight: 700 }}>Dashboard</Typography>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6} lg={6}>
          <Plate title="Date Filter">
            <DateFilter range={dateRange} onChange={handleDateRangeChange} />
          </Plate>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Plate title="Study Stats">
            {loading ? (
              <Stack alignItems="center" sx={{ py: 4 }}>
                <CircularProgress />
              </Stack>
            ) : stats ? (
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Total Time Studied</Typography>
                  <Typography variant="h6">
                    {Math.floor(stats.total_seconds / 3600)}h {Math.floor((stats.total_seconds % 3600) / 60)}m
                  </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Task Completion Rate</Typography>
                  <Typography variant="h6">{stats.completion_rate.toFixed(1)}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.tasks_completed} / {stats.tasks_total} tasks
                  </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Total Sessions</Typography>
                  <Typography variant="h6">{stats.total_sessions}</Typography>
                </Paper>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">No data available</Typography>
            )}
          </Plate>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Plate title="Tasks Overview">
            {loading ? (
              <Stack alignItems="center" sx={{ py: 4 }}>
                <CircularProgress />
              </Stack>
            ) : stats ? (
              <Stack spacing={1}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Tasks Completed</Typography>
                  <Typography variant="h6">{stats.tasks_completed}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Study Streak</Typography>
                  <Typography variant="h6">{stats.streak_days} days</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Flashcards Created</Typography>
                  <Typography variant="h6">{stats.cards_created}</Typography>
                </Paper>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">No data available</Typography>
            )}
          </Plate>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Plate title="Calendar">
            {loading && allSessions.length === 0 ? (
              <Stack alignItems="center" sx={{ py: 4 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <Calendar sessions={allSessions} dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
            )}
          </Plate>
        </Grid>
      </Grid>
    </Box>
  );
}
