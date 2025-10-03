import DateFilter from '../components/DateFilter';
import Box from '@mui/material/Box';


export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <h1 style={{textAlign: 'left'}}>Dashboard</h1>
      <DateFilter />
    </Box>
  );
}
