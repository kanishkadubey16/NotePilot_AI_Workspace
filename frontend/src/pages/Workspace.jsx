import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import { NoteProvider } from '../context/NoteContext';
import '../styles/workspace.css';

export default function Workspace() {
  return (
    <NoteProvider>
      <div className="workspace-view">
        <NotesList />
        <NoteEditor />
      </div>
    </NoteProvider>
  );
}
