import { useContext } from 'react';
import { NoteContext } from '../context/NoteContext';

const NoteCard = ({ note }) => {
  const { selectedNote, selectNote } = useContext(NoteContext);
  const isActive = selectedNote?._id === note._id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className={`note-card ${isActive ? 'active' : ''}`}
      onClick={() => selectNote(note)}
    >
      <div className="note-card-header">
        <h4 className="note-card-title">{note.title || 'Untitled Note'}</h4>
        <span className="note-card-date">{formatDate(note.updatedAt)}</span>
      </div>
      <p className="note-card-preview">
        {note.content ? note.content.substring(0, 60) + (note.content.length > 60 ? '...' : '') : 'No content...'}
      </p>
      {note.tags && note.tags.length > 0 && (
        <div className="note-card-tags">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="note-tag-pill">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default function NotesList() {
  const { notes, createNote, loading } = useContext(NoteContext);

  return (
    <div className="notes-list-container">
      <div className="notes-list-header">
        <h3>My Notes</h3>
        <button className="new-note-btn" onClick={createNote}>
          <span className="plus-icon">+</span> New
        </button>
      </div>
      <div className="notes-list-scroll">
        {loading ? (
          <div className="list-placeholder">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="list-placeholder">No notes found</div>
        ) : (
          notes.map(note => (
            <NoteCard key={note._id} note={note} />
          ))
        )}
      </div>
    </div>
  );
}
