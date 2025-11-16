import { Paper, Typography, CircularProgress, Box } from '@mui/material';

interface AIFeedbackProps {
  feedback: string | null;
  loading: boolean;
}

export default function AIFeedback({ feedback, loading }: AIFeedbackProps) {
  if (loading) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>AI Feedback</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">Generating personalized feedback...</Typography>
        </Box>
      </Paper>
    );
  }

  if (!feedback) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, backgroundColor: 'primary.dark', color: 'primary.contrastText' }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>AI Study Feedback</Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{feedback}</Typography>
    </Paper>
  );
}

