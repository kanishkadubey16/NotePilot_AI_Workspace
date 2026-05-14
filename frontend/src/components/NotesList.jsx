import { useContext } from 'react';
import { NoteContext } from '../context/NoteContext';

const NoteCard = ({ note }) => {
  const { selectedNote, selectNote } = useContext(NoteContext);
  const isActive = selectedNote?._id === note._id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
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
        {note.content ? note.content.substring(0, 70) + (note.content.length > 70 ? '...' : '') : 'No content added yet...'}
      </p>
      <div className="note-card-footer">
        {note.category && <span className="note-category-tag">{note.category}</span>}
        <div className="note-card-tags">
          {note.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="note-tag-pill">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function NotesList() {
  const { notes, createNote, loading, searchQuery, setSearchQuery, activeCategory, setActiveCategory, view } = useContext(NoteContext);

  const categories = ['All', 'Work', 'Personal', 'Idea'];

  return (
    <div className="notes-list-container">
      <div className="notes-list-header">
        <div className="list-title-row">
          <h3>{view === 'archived' ? 'Archived' : 'My Notes'}</h3>
          <button className="new-note-btn" onClick={createNote} title="Create New Note">
            <span>+</span> New
          </button>
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search notes..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="notes-list-scroll">
        {loading ? (
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <p>{searchQuery ? 'No results found' : 'No notes here yet'}</p>
          </div>
        ) : (
          notes.map(note => (
            <NoteCard key={note._id} note={note} />
          ))
        )}
      </div>
    </div>
  );
}
