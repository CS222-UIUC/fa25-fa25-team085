import {Routes, Route, Navigate} from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';
import { Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <SessionProvider>
                    <div className="app-root">
                        <NavBar />
                        <Box component="main" sx={{ pt: '96px', pb: 4 }}> { /* offset for fixed navbar */ }
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/study" element={<ProtectedRoute><Study /></ProtectedRoute>} />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </Box>
                    </div>
                </SessionProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}