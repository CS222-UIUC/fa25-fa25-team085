import { Link } from 'react-router-dom';
import './NavBar.css';
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('username');
    setUsername(stored);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-left">
        <img src="src/assets/LIT_Logo.png" alt="Logo" className="nav-logo" />
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
            Dashboard
        </NavLink>
        <NavLink to="/study" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
            Study
        </NavLink>
      </div>
      <div className="nav-right">
        {username ? (
          <div className="user-pill" aria-label="User">
            <span className="user-avatar" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#2a2a2a" stroke="#4a4a4a"/>
                <circle cx="12" cy="10" r="3.2" fill="#9a9a9a"/>
                <path d="M5.5 19c1.7-3 4.6-4.5 6.5-4.5S16.8 16 18.5 19" fill="#9a9a9a"/>
              </svg>
            </span>
            <span className="user-name">{username}</span>
          </div>
        ) : (
          <Link to="/login" className="nav-link">Log in</Link>
        )}
      </div>
    </nav>
  );
}
