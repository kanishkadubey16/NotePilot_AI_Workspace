import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NoteContext } from '../context/NoteContext';

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext);
  const { setView, view, setActiveCategory } = useContext(NoteContext);

  const handleNavClick = (newView) => {
    setView(newView);
    setActiveCategory('All');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="logo-icon">🚀</span>
          <h2>NotePilot AI</h2>
        </div>
        <div className="user-profile">
          <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
          <span className="username">{user?.name}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <label>Main</label>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            🏠 Dashboard
          </NavLink>
          <NavLink 
            to="/workspace" 
            onClick={() => handleNavClick('all')}
            className={() => view === 'all' && window.location.pathname === '/workspace' ? 'nav-item active' : 'nav-item'}
          >
            📝 All Notes
          </NavLink>
          <NavLink 
            to="/workspace" 
            onClick={() => handleNavClick('archived')}
            className={() => view === 'archived' ? 'nav-item active' : 'nav-item'}
          >
            📦 Archived
          </NavLink>
        </div>

        <div className="nav-group">
          <label>Features</label>
          <div className="nav-item coming-soon">✨ AI Summary</div>
          <div className="nav-item coming-soon">🛠️ Action Items</div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
