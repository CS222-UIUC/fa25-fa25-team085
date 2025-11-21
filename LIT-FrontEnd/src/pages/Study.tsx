import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, LinearProgress, Paper, Stack, Tab, Tabs, TextField, Typography, Checkbox, List, ListItem, ListItemIcon, ListItemText, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AIFeedback from '../components/AIFeedback';
import { StudySession } from '../types';

type TabKey = 'checklist' | 'flashcards' | 'notes';

export default function Study() {
  const { user } = useAuth();
  const { draftSession, updateDraftSession, clearDraftSession } = useSession();
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [tab, setTab] = useState<TabKey>('checklist');
  const timerRef = useRef<number | null>(null);
  const [cardsAddedDuringSession, setCardsAddedDuringSession] = useState(0);
  const [sessionSummary, setSessionSummary] = useState<null | {
    durationSeconds: number;
    completedTasks: number;
    totalTasks: number;
    cardsAdded: number;
    score: number | null;
    aiFeedback: string | null;
  }>(null);
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);

  // Load from draft session or initialize
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>(
    draftSession?.tasks || [
      { id: 't1', text: 'Review lecture 5', done: false },
      { id: 't2', text: 'Complete problem set', done: false },
      { id: 't3', text: 'Summarize key terms', done: false },
    ]
  );
  const [newTask, setNewTask] = useState('');
  type Card = { front: string; back: string };
  const [cards, setCards] = useState<Card[]>(
    draftSession?.cards || [
      { front: 'What is Big-O of binary search?', back: 'O(log n)' },
      { front: 'Derivative of sin(x)', back: 'cos(x)' },
    ]
  );
  const [notes, setNotes] = useState(draftSession?.notes || '');

  // Sync to session context
  useEffect(() => {
    updateDraftSession({ tasks, cards, notes, duration_seconds: seconds });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, cards, notes, seconds]);

  const addTask = () => {
    if (!active) return;
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [{ id: crypto.randomUUID(), text, done: false }, ...prev]);
    setNewTask('');
  };
  const toggleTask = (id: string) => {
    if (!active) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };
  const removeTask = (id: string) => {
    if (!active) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const [cardIndex, setCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const hasPrev = cardIndex > 0;
  const hasNext = cardIndex < cards.length - 1;
  const flip = () => { setShowBack((s) => !s); };
  const goPrev = () => { if (hasPrev) { setCardIndex((i) => i - 1); setShowBack(false); } };
  const goNext = () => { if (hasNext) { setCardIndex((i) => i + 1); setShowBack(false); } };
  const addCard = () => {
    const front = window.prompt('Flashcard front');
    if (front == null) return;
    const trimmedFront = front.trim();
    if (!trimmedFront) return;
    const back = window.prompt('Flashcard back') ?? '';
    const trimmedBack = back.trim();
    
    setCards((prev) => {
      const newCards = [...prev, { front: trimmedFront, back: trimmedBack }];
      // Update index to point to the newly added card (last card)
      setCardIndex(newCards.length - 1);
      return newCards;
    });
    setShowBack(false);
    if (active) {
      setCardsAddedDuringSession((n) => n + 1);
    }
  };

  const removeCard = () => {
    if (cards.length === 0) return;
    const ok = window.confirm('Are you sure you want to remove this flashcard?');
    if (!ok) return;
    
    const currentIndex = cardIndex;
    const currentLength = cards.length;
    
    setCards((prev) => {
      if (prev.length === 0) return prev;
      return prev.filter((_, index) => index !== currentIndex);
    });
    
    // Adjust index after removal
    const newLength = currentLength - 1;
    if (newLength === 0) {
      setCardIndex(0);
    } else if (currentIndex >= newLength) {
      // If removing the last card, go to the previous one
      setCardIndex(newLength - 1);
    }
    // If removing a card in the middle, index stays the same (shows next card)
    
    setShowBack(false);
  };

  const handleStartEnd = async () => {
    if (!active) {
      // Start new session
      setSeconds(0);
      setCardsAddedDuringSession(0);
      setSessionSummary(null);
      setActive(true);
      setSessionStartedAt(new Date().toISOString());
      updateDraftSession({ started_at: new Date().toISOString() });
      return;
    }
    // Ending session
    const ok = window.confirm('End session and save progress?');
    if (!ok) return;

    const completedTasks = tasks.filter((t) => t.done).length;
    const totalTasks = tasks.length;

    // Save session to backend
    if (user) {
      setAiFeedbackLoading(true);
      try {
        // TODO: Replace with actual Supabase insert
        const sessionData: Partial<StudySession> = {
          user_id: user.id,
          started_at: sessionStartedAt || new Date().toISOString(),
          ended_at: new Date().toISOString(),
          duration_seconds: seconds,
          tasks_completed: completedTasks,
          tasks_total: totalTasks,
          cards_added: cardsAddedDuringSession,
          notes: notes || null,
          secondary_timer_mode: secMode,
          secondary_timer_work_min: secMode === 'pomodoro' || secMode === 'custom' ? (secMode === 'pomodoro' ? pomoWorkMin : customWorkMin) : null,
          secondary_timer_break_min: secMode === 'pomodoro' || secMode === 'custom' ? (secMode === 'pomodoro' ? pomoBreakMin : customBreakMin) : null,
        };

        // Insert session
        const { data, error } = await supabase.from('study_sessions').insert(sessionData);
        if (error) {
          console.error('Error saving session:', error);
        } else {
          console.log('Session saved:', data);
        }

        // TODO: Call AI feedback API
        // For now, simulate AI feedback
        setTimeout(() => {
          const feedback = `Great session! You studied for ${Math.floor(seconds / 60)} minutes and completed ${completedTasks} out of ${totalTasks} tasks. Keep up the momentum!`;
          setSessionSummary({
            durationSeconds: seconds,
            completedTasks,
            totalTasks,
            cardsAdded: cardsAddedDuringSession,
            score: null, // Will come from backend
            aiFeedback: feedback,
          });
          setAiFeedbackLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error ending session:', error);
        setAiFeedbackLoading(false);
      }
    } else {
      // No user, just show summary
      setSessionSummary({
        durationSeconds: seconds,
        completedTasks,
        totalTasks,
        cardsAdded: cardsAddedDuringSession,
        score: null,
        aiFeedback: null,
      });
    }

    setActive(false);
    clearDraftSession();
  };

  useEffect(() => {
    if (!active) return;
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [active]);

  const progress = useMemo(() => Math.min(100, (seconds % 1500) / 15), [seconds]);

  // Secondary timers
  type SecondaryMode = 'stopwatch' | 'countdown' | 'pomodoro' | 'custom';
  type Phase = 'work' | 'break';
  const [secMode, setSecMode] = useState<SecondaryMode>(draftSession?.secondary_timer?.mode || 'stopwatch');
  const [secRunning, setSecRunning] = useState(false);
  const [secElapsed, setSecElapsed] = useState(0);
  const [secRemaining, setSecRemaining] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState(25);
  const [pomoWorkMin, setPomoWorkMin] = useState(25);
  const [pomoBreakMin, setPomoBreakMin] = useState(5);
  const [customWorkMin, setCustomWorkMin] = useState(30);
  const [customBreakMin, setCustomBreakMin] = useState(10);
  const [phase, setPhase] = useState<Phase>('work');
  const secTimerRef = useRef<number | null>(null);

  const resetSecondary = () => {
    setSecRunning(false);
    setSecElapsed(0);
    setPhase('work');
    if (secMode === 'countdown') setSecRemaining(Math.max(0, Math.floor(countdownMinutes * 60)));
    else if (secMode === 'pomodoro') setSecRemaining(Math.max(0, Math.floor(pomoWorkMin * 60)));
    else if (secMode === 'custom') setSecRemaining(Math.max(0, Math.floor(customWorkMin * 60)));
    else setSecRemaining(0);
  };

  useEffect(() => { resetSecondary(); }, [secMode]);
  useEffect(() => { if (secMode === 'countdown') setSecRemaining(Math.max(0, Math.floor(countdownMinutes * 60))); }, [countdownMinutes]);
  useEffect(() => { if (secMode === 'pomodoro') setSecRemaining(Math.max(0, Math.floor(pomoWorkMin * 60))); }, [pomoWorkMin]);
  useEffect(() => { if (secMode === 'custom') setSecRemaining(Math.max(0, Math.floor(customWorkMin * 60))); }, [customWorkMin]);

  useEffect(() => {
    if (!active || !secRunning) return;
    secTimerRef.current = window.setInterval(() => {
      if (secMode === 'stopwatch') {
        setSecElapsed((s) => s + 1);
      } else if (secMode === 'countdown') {
        setSecRemaining((r) => {
          if (r <= 1) { setSecRunning(false); return 0; }
          return r - 1;
        });
      } else {
        setSecRemaining((r) => {
          if (r <= 1) {
            const nextPhase: Phase = phase === 'work' ? 'break' : 'work';
            setPhase(nextPhase);
            const nextMinutes = secMode === 'pomodoro'
              ? (nextPhase === 'work' ? pomoWorkMin : pomoBreakMin)
              : (nextPhase === 'work' ? customWorkMin : customBreakMin);
            return Math.max(0, Math.floor(nextMinutes * 60));
          }
          return r - 1;
        });
      }
    }, 1000);
    return () => { if (secTimerRef.current) window.clearInterval(secTimerRef.current); };
  }, [active, secRunning, secMode, phase, pomoWorkMin, pomoBreakMin, customWorkMin, customBreakMin]);

  useEffect(() => { if (!active) setSecRunning(false); }, [active]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ textAlign: 'left', mb: 2, fontWeight: 700 }}>Study</Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
        <Paper sx={{ p: 2.5, flex: 1 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button color="primary" onClick={handleStartEnd}>
                {active ? 'End Session' : 'Start Session'}
              </Button>
              <Typography variant="body1" color="text.secondary">Timer: {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 10 }} />
            {/* Secondary timers */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Secondary Timer</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 1 }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="mode-label">Mode</InputLabel>
                  <Select labelId="mode-label" label="Mode" value={secMode} onChange={(e) => setSecMode(e.target.value as SecondaryMode)}>
                    <MenuItem value="stopwatch">Stopwatch</MenuItem>
                    <MenuItem value="countdown">Countdown</MenuItem>
                    <MenuItem value="pomodoro">Pomodoro</MenuItem>
                    <MenuItem value="custom">Custom Cycle</MenuItem>
                  </Select>
                </FormControl>
                {secMode === 'countdown' && (
                  <TextField size="small" type="number" label="Minutes" value={countdownMinutes} onChange={(e) => setCountdownMinutes(Number(e.target.value))} sx={{ width: 120 }} disabled={!active || secRunning} />
                )}
                {secMode === 'pomodoro' && (
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" type="number" label="Work (min)" value={pomoWorkMin} onChange={(e) => setPomoWorkMin(Number(e.target.value))} sx={{ width: 130 }} disabled={!active || secRunning} />
                    <TextField size="small" type="number" label="Break (min)" value={pomoBreakMin} onChange={(e) => setPomoBreakMin(Number(e.target.value))} sx={{ width: 130 }} disabled={!active || secRunning} />
                  </Stack>
                )}
                {secMode === 'custom' && (
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" type="number" label="Work (min)" value={customWorkMin} onChange={(e) => setCustomWorkMin(Number(e.target.value))} sx={{ width: 130 }} disabled={!active || secRunning} />
                    <TextField size="small" type="number" label="Break (min)" value={customBreakMin} onChange={(e) => setCustomBreakMin(Number(e.target.value))} sx={{ width: 130 }} disabled={!active || secRunning} />
                  </Stack>
                )}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 160 }}>
                  {secMode === 'stopwatch' && `Elapsed: ${Math.floor(secElapsed / 60)}:${(secElapsed % 60).toString().padStart(2, '0')}`}
                  {secMode === 'countdown' && `Remaining: ${Math.floor(secRemaining / 60)}:${(secRemaining % 60).toString().padStart(2, '0')}`}
                  {(secMode === 'pomodoro' || secMode === 'custom') && `${phase.toUpperCase()} - ${Math.floor(secRemaining / 60)}:${(secRemaining % 60).toString().padStart(2, '0')}`}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => setSecRunning(true)} disabled={!active || secRunning}>Start</Button>
                  <Button onClick={() => setSecRunning(false)} disabled={!active || !secRunning}>Pause</Button>
                  <Button onClick={resetSecondary} disabled={!active}>Reset</Button>
                </Stack>
              </Stack>
            </Paper>
            {sessionSummary && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Session saved</Typography>
                <Typography variant="body2">Duration: {Math.floor(sessionSummary.durationSeconds / 60)}m {(sessionSummary.durationSeconds % 60).toString().padStart(2, '0')}s</Typography>
                <Typography variant="body2">Tasks: {sessionSummary.completedTasks} / {sessionSummary.totalTasks} completed</Typography>
                <Typography variant="body2">Flashcards added: {sessionSummary.cardsAdded}</Typography>
                {sessionSummary.score !== null && (
                  <Typography variant="body2">Score: {sessionSummary.score}</Typography>
                )}
              </Paper>
            )}
            {sessionSummary && (
              <AIFeedback feedback={sessionSummary.aiFeedback} loading={aiFeedbackLoading} />
            )}
          </Stack>
        </Paper>

        <Paper sx={{ p: 2.5, flex: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Checklist" value="checklist" />
            <Tab label="Flashcards" value="flashcards" />
            <Tab label="Notes" value="notes" />
          </Tabs>

          {tab === 'checklist' && (
            <Stack spacing={1.5}>
              <List>
                {tasks.map((t) => (
                  <ListItem key={t.id} secondaryAction={
                    <Button size="small" color="secondary" onClick={() => removeTask(t.id)} disabled={!active}>Remove</Button>
                  } sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox edge="start" tabIndex={-1} disableRipple checked={t.done} onChange={() => toggleTask(t.id)} disabled={!active} />
                    </ListItemIcon>
                    <ListItemText primary={t.text} sx={{ textDecoration: t.done ? 'line-through' : 'none' }} />
                  </ListItem>
                ))}
              </List>
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField size="small" fullWidth placeholder="New task" value={newTask} onChange={(e) => setNewTask(e.target.value)} disabled={!active} onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }} />
                <Button onClick={addTask} disabled={!active || newTask.trim() === ''}>Add</Button>
              </Stack>
            </Stack>
          )}

          {tab === 'flashcards' && (
            <Stack spacing={2}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  cursor: cards.length > 0 ? 'pointer' : 'default', 
                  userSelect: 'none',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }} 
                onClick={() => { if (cards.length > 0) flip(); }}
              >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {showBack ? 'Back' : 'Front'} {cards.length > 0 && `(${cardIndex + 1} of ${cards.length})`}
                </Typography>
                <Typography variant="h6">
                  {cards.length > 0 
                    ? (cards[cardIndex]?.[showBack ? 'back' : 'front'] ?? 'No card content')
                    : 'No cards yet. Add a card to get started!'}
                </Typography>
              </Paper>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                <Button onClick={goPrev} disabled={!hasPrev || cards.length === 0} size="small">Previous</Button>
                <Button onClick={() => flip()} disabled={cards.length === 0} size="small" variant="outlined">
                  {showBack ? 'Show Front' : 'Show Back'}
                </Button>
                <Button onClick={goNext} disabled={!hasNext || cards.length === 0} size="small">Next</Button>
                <Button onClick={addCard} size="small" color="primary">Add Card</Button>
                <Button 
                  onClick={removeCard} 
                  disabled={cards.length === 0} 
                  color="error" 
                  variant="outlined"
                  size="small"
                >
                  Remove Card
                </Button>
              </Stack>
            </Stack>
          )}

          {tab === 'notes' && (
            <TextField multiline minRows={8} fullWidth placeholder="Session notes..." value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!active} />
          )}
        </Paper>
      </Stack>
    </Box>
  );
}
