import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>NotePilot AI</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Dashboard
        </NavLink>
        <NavLink to="/workspace" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          All Notes
        </NavLink>
        <NavLink to="/archived" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Archived Notes
        </NavLink>
        <NavLink to="/tags" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Tags
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Categories
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </aside>
  );
}
