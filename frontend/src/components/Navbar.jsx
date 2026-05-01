import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">TaskMaster</Link>
      <div className="navbar-links">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FolderKanban size={18} /> Projects
        </Link>
        <Link to="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={18} /> Tasks
        </Link>
        <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>| {user.name} ({user.role})</span>
        <button onClick={handleLogout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
