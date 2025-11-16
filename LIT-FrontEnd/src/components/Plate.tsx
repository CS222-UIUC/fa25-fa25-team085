import { Paper, Typography } from '@mui/material';
import { ReactNode } from 'react';

export default function Plate({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Paper elevation={4} sx={{ p: 2.5 }}>
      <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>{title}</Typography>
      {children}
    </Paper>
  );
}

