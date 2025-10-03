import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, Paper, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

export default function DateFilter() {
  const today = dayjs();
  const [range, setRange] = React.useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const handlePreset = (days: number) => {
    setRange([today.subtract(days, 'day'), today]);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#1f1f1f', color: 'white' }}>
      <h2 style={{ marginTop: 0 }}>Select Date Range</h2>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => handlePreset(7)}>Past Week</Button>
        <Button variant="outlined" onClick={() => handlePreset(30)}>Past Month</Button>
        <Button variant="outlined" onClick={() => handlePreset(365)}>Past Year</Button>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', gap: 2}}>
          <DatePicker
            label="Start Date"
            value={range[0]}
            onChange={(newValue) => setRange([newValue, range[1]])}
            maxDate={today}
            slotProps={{ textField: { sx: { backgroundColor: 'white', borderRadius: 1 } } }}
          />
          <DatePicker
            label="End Date"
            value={range[1]}
            onChange={(newValue) => setRange([range[0], newValue])}
            maxDate={today}
            slotProps={{ textField: { sx: { backgroundColor: 'white', borderRadius: 1 } } }}
          />
        </Box>
      </LocalizationProvider>
    </Paper>
  );
}
