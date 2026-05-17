import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ closeSidebar }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="logo-icon">🚀</span>
          <h2>NotePilot</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <NavLink to="/dashboard" onClick={closeSidebar} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="icon">📊</span> Dashboard
          </NavLink>
        </div>

        <div className="nav-group">
          <label>NOTES</label>
          <NavLink to="/workspace" onClick={closeSidebar} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="icon">📄</span> All notes
          </NavLink>
          <NavLink to="/archived" onClick={closeSidebar} className="nav-item">
            <span className="icon">📦</span> Archived
          </NavLink>
        </div>

        <div className="nav-group">
          <label>ACCOUNT</label>
          <NavLink to="/settings" onClick={closeSidebar} className="nav-item">
            <span className="icon">⚙️</span> Settings
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="ai-banner">
          <h4>✨ AI Assistant</h4>
          <p>Claude Sonnet 4.5 enabled across your workspace.</p>
        </div>

        <div className="user-profile">
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="user-info">
            <h5>{user?.name || 'User'}</h5>
            <p>{user?.email || 'user@example.com'}</p>
          </div>
          <button onClick={logout} className="logout-mini-btn">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
