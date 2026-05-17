import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { NoteProvider } from '../context/NoteContext';
import '../styles/workspace.css';

export default function WorkspaceLayout() {
  return (
    <NoteProvider>
      <div className="workspace-container">
        <Sidebar />
        <div className="workspace-content">
          <Outlet />
        </div>
      </div>
    </NoteProvider>
  );
}
