import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">✦ TaskMaster</Link>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link
          to="/projects"
          className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
        >
          <FolderKanban size={16} /> Projects
        </Link>
        <Link
          to="/tasks"
          className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
        >
          <CheckSquare size={16} /> Tasks
        </Link>

        <div className="nav-divider" />

        <div className="nav-user">
          <div className="nav-user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span className="nav-user-info">{user.name}</span>
          <span className="nav-role-badge">{user.role}</span>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm"
          id="logout-button"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
