import { useContext, useEffect, useState } from 'react';
import { NoteContext } from '../context/NoteContext';
import AIPanel from './AIPanel';

export default function NoteEditor() {
  const { selectedNote, updateSelectedNote, saveStatus, deleteNote, toggleArchive } = useContext(NoteContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [selectedNote?._id]);

  if (!selectedNote) {
    return (
      <div className="editor-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">📄</div>
          <h3>Select a note to view</h3>
          <p>Choose a note from the list on the left to start editing, or create a new one.</p>
        </div>
      </div>
    );
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    updateSelectedNote({ title: e.target.value });
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    updateSelectedNote({ content: e.target.value });
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim());
    updateSelectedNote({ tags: tagsArray });
  };

  return (
    <div className="note-editor">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <div className={`save-status ${saveStatus}`}>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save Failed' : 'Saved'}
          </div>
        </div>
        <div className="toolbar-right">
          <button 
            className={`tool-btn ${selectedNote.isArchived ? 'active' : ''}`} 
            onClick={() => toggleArchive(selectedNote._id)}
            title={selectedNote.isArchived ? 'Unarchive' : 'Archive'}
          >
            📦
          </button>
          <button 
            className="tool-btn delete" 
            onClick={() => deleteNote(selectedNote._id)}
            title="Delete Note"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="editor-meta-bar">
        <div className="meta-item">
          <label>Category</label>
          <select 
            value={selectedNote.category || ''} 
            onChange={(e) => updateSelectedNote({ category: e.target.value })}
          >
            <option value="">None</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Idea">Idea</option>
          </select>
        </div>
        <div className="meta-item flex-grow">
          <label>Tags</label>
          <input 
            type="text" 
            placeholder="tag1, tag2..." 
            value={selectedNote.tags?.join(', ') || ''}
            onChange={handleTagsChange}
          />
        </div>
      </div>

      <div className="editor-layout-main">
        <div className="editor-canvas">
          <input
            type="text"
            className="editor-title-field"
            placeholder="Note Title"
            value={title}
            onChange={handleTitleChange}
          />
          <textarea
            className="editor-body-field"
            placeholder="Start typing your thoughts..."
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <AIPanel />
      </div>
    </div>
  );
}
