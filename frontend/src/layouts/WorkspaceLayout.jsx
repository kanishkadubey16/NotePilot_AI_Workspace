import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/workspace.css';

export default function WorkspaceLayout() {
  return (
    <div className="workspace-container">
      <Sidebar />
      <div className="workspace-content">
        <Outlet />
      </div>
    </div>
  );
}
