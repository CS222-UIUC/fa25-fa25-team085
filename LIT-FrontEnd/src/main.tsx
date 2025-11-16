import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6' },
    background: {
      default: '#0f172a',
      paper: '#141b2d'
    }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'DM Sans, Inter, system-ui, Arial',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    },
    MuiButton: {
      defaultProps: { variant: 'contained' }
    }
  }
});



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>      
    </ThemeProvider>
  </React.StrictMode>,
)