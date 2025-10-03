import {Routes, Route, Navigate} from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import './App.css';

export default function App() {
    return (
        <div className="app-root">
            <NavBar />
            <main>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/study" element={<Study />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </div>
    );
}