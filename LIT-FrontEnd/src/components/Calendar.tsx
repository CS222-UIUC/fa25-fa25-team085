import { useState } from 'react';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { StudySession } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface CalendarProps {
  sessions: StudySession[];
  dateRange: [Dayjs | null, Dayjs | null];
  onDateRangeChange: (range: [Dayjs | null, Dayjs | null]) => void;
}

export default function Calendar({ sessions, dateRange, onDateRangeChange }: CalendarProps) {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);
  const startOfMonth = currentMonth.startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfWeek = startOfMonth.day();
  const [firstClick, setFirstClick] = useState<Dayjs | null>(null);

  // Group sessions by date
  const sessionsByDate = (sessions || []).reduce((acc, session) => {
    if (!session || !session.started_at) return acc;
    try {
      const date = dayjs(session.started_at).format('YYYY-MM-DD');
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
    } catch (e) {
      console.error('Error processing session:', e, session);
    }
    return acc;
  }, {} as Record<string, StudySession[]>);

  const getSessionsForDate = (date: Dayjs) => {
    const key = date.format('YYYY-MM-DD');
    return sessionsByDate[key] || [];
  };

  const isDateInRange = (date: Dayjs) => {
    if (!dateRange[0] || !dateRange[1]) return false;
    const start = dayjs(dateRange[0]);
    const end = dayjs(dateRange[1]);
    if (!start.isValid() || !end.isValid()) return false;
    return date.isSameOrAfter(start, 'day') && date.isSameOrBefore(end, 'day');
  };

  const handleDateClick = (date: Dayjs) => {
    if (!firstClick) {
      // First click - set as start date
      setFirstClick(date);
      onDateRangeChange([date, date]);
    } else {
      // Second click - set as end date
      if (date.isBefore(firstClick)) {
        // If clicked date is before first, swap them
        onDateRangeChange([date, firstClick]);
      } else {
        onDateRangeChange([firstClick, date]);
      }
      setFirstClick(null);
    }
  };

  const handleClearSelection = () => {
    setFirstClick(null);
    onDateRangeChange([null, null]);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = Array.from({ length: daysInMonth }, (_, i) => startOfMonth.add(i, 'day'));

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {currentMonth.format('MMMM YYYY')}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}>
            ‹
          </Button>
          <Button size="small" onClick={() => setCurrentMonth(today)}>
            Today
          </Button>
          <Button size="small" onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}>
            ›
          </Button>
        </Stack>
      </Stack>
      {firstClick && (
        <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 1 }}>
          Click another date to set range, or click same date for single day
        </Typography>
      )}
      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
        {weekDays.map((day) => (
          <Box key={day} sx={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
            {day}
          </Box>
        ))}
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <Box key={`empty-${i}`} />
        ))}
        {days.map((date) => {
          const dateSessions = getSessionsForDate(date);
          const isToday = date.isSame(today, 'day');
          const isInRange = isDateInRange(date);
          const startDate = dateRange[0] ? dayjs(dateRange[0]) : null;
          const endDate = dateRange[1] ? dayjs(dateRange[1]) : null;
          const isStart = startDate && startDate.isValid() && date.isSame(startDate, 'day');
          const isEnd = endDate && endDate.isValid() && date.isSame(endDate, 'day');
          return (
            <Paper
              key={date.format('YYYY-MM-DD')}
              onClick={() => handleDateClick(date)}
              sx={{
                p: 1,
                minHeight: 60,
                cursor: 'pointer',
                backgroundColor: isStart || isEnd
                  ? 'primary.main'
                  : isInRange
                  ? 'primary.dark'
                  : isToday
                  ? 'action.selected'
                  : 'background.paper',
                border: isToday ? '2px solid' : '1px solid',
                borderColor: isStart || isEnd ? 'primary.light' : isToday ? 'primary.main' : 'divider',
                '&:hover': { backgroundColor: isStart || isEnd ? 'primary.light' : 'action.hover' },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isToday || isStart || isEnd ? 700 : 400,
                  mb: 0.5,
                  color: isStart || isEnd ? 'primary.contrastText' : 'inherit',
                }}
              >
                {date.date()}
              </Typography>
              {dateSessions.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: isStart || isEnd ? 'primary.contrastText' : 'text.secondary' }}
                >
                  {dateSessions.length} session{dateSessions.length !== 1 ? 's' : ''}
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
      {(dateRange[0] || dateRange[1]) && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {(() => {
                const start = dateRange[0] ? dayjs(dateRange[0]) : null;
                const end = dateRange[1] ? dayjs(dateRange[1]) : null;
                if (start && end && start.isValid() && end.isValid() && start.isSame(end, 'day')) {
                  return `Sessions on ${start.format('MMMM D, YYYY')}`;
                }
                if (start && end && start.isValid() && end.isValid()) {
                  return `Sessions from ${start.format('MMM D')} to ${end.format('MMM D, YYYY')}`;
                }
                if (start && start.isValid()) {
                  return `Sessions from ${start.format('MMMM D, YYYY')}`;
                }
                return 'Sessions';
              })()}
            </Typography>
            <Button size="small" onClick={handleClearSelection}>
              Clear
            </Button>
          </Stack>
          <Stack spacing={1}>
            {(sessions || [])
              .filter((session) => {
                if (!session || !session.started_at) return false;
                try {
                  const sessionDate = dayjs(session.started_at);
                  if (!sessionDate.isValid()) return false;
                  if (dateRange[0] && dateRange[1]) {
                    const start = dayjs(dateRange[0]);
                    const end = dayjs(dateRange[1]);
                    if (!start.isValid() || !end.isValid()) return false;
                    return sessionDate.isSameOrAfter(start, 'day') && sessionDate.isSameOrBefore(end, 'day');
                  }
                  if (dateRange[0]) {
                    const start = dayjs(dateRange[0]);
                    if (!start.isValid()) return false;
                    return sessionDate.isSame(start, 'day');
                  }
                  return false;
                } catch (e) {
                  console.error('Error filtering session:', e, session);
                  return false;
                }
              })
              .map((session) => (
                <Paper key={session.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography variant="body2">
                    {Math.floor(session.duration_seconds / 60)}m {session.duration_seconds % 60}s
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(session.started_at).format('MMM D, h:mm A')} - {session.tasks_completed}/{session.tasks_total} tasks
                  </Typography>
                </Paper>
              ))}
            {(sessions || []).filter((session) => {
              if (!session || !session.started_at) return false;
              try {
                const sessionDate = dayjs(session.started_at);
                if (!sessionDate.isValid()) return false;
                if (dateRange[0] && dateRange[1]) {
                  const start = dayjs(dateRange[0]);
                  const end = dayjs(dateRange[1]);
                  if (!start.isValid() || !end.isValid()) return false;
                  return sessionDate.isSameOrAfter(start, 'day') && sessionDate.isSameOrBefore(end, 'day');
                }
                if (dateRange[0]) {
                  const start = dayjs(dateRange[0]);
                  if (!start.isValid()) return false;
                  return sessionDate.isSame(start, 'day');
                }
                return false;
              } catch (e) {
                return false;
              }
            }).length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No sessions in selected range
              </Typography>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

