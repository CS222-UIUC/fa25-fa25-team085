import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

interface DateFilterProps {
  range?: [Dayjs | null, Dayjs | null];
  onChange?: (range: [Dayjs | null, Dayjs | null]) => void;
}

export default function DateFilter({ range: controlledRange, onChange }: DateFilterProps) {
  const today = dayjs();
  const [internalRange, setInternalRange] = React.useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(7, 'day'), dayjs()]);
  const range = controlledRange || internalRange;

  const updateRange = (newRange: [Dayjs | null, Dayjs | null]) => {
    if (onChange) {
      onChange(newRange);
    } else {
      setInternalRange(newRange);
    }
  };

  const handlePreset = (days: number) => {
    updateRange([today.subtract(days, 'day'), today]);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <Button variant="outlined" onClick={() => handlePreset(7)}>Past Week</Button>
        <Button variant="outlined" onClick={() => handlePreset(30)}>Past Month</Button>
        <Button variant="outlined" onClick={() => handlePreset(365)}>Past Year</Button>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <DatePicker
            label="Start Date"
            value={range[0]}
            onChange={(newValue) => updateRange([newValue, range[1]])}
            maxDate={today}
          />
          <DatePicker
            label="End Date"
            value={range[1]}
            onChange={(newValue) => updateRange([range[0], newValue])}
            maxDate={today}
          />
        </Box>
      </LocalizationProvider>
    </>
  );
}
