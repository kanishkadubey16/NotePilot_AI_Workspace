import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { NoteProvider } from '../context/NoteContext';
import '../styles/workspace.css';

export default function WorkspaceLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <NoteProvider>
      <div className={`workspace-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>

        {/* Clicking outside closes the drawer */}
        <div 
          className="sidebar-mobile-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
        <div className="workspace-content-outlet">
          <Outlet />
        </div>
      </div>
    </NoteProvider>
  );
}
