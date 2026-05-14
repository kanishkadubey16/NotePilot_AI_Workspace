import { useContext, useEffect, useState } from 'react';
import { NoteContext } from '../context/NoteContext';

export default function NoteEditor() {
  const { selectedNote, updateSelectedNote, saveStatus } = useContext(NoteContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
    }
  }, [selectedNote?._id]);

  if (!selectedNote) {
    return (
      <div className="editor-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">📝</div>
          <h3>No Note Selected</h3>
          <p>Select a note from the list or create a new one to start writing.</p>
        </div>
      </div>
    );
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateSelectedNote({ title: newTitle });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateSelectedNote({ content: newContent });
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <div className="save-status-container">
          {saveStatus === 'saving' && <span className="status-saving">Saving...</span>}
          {saveStatus === 'saved' && <span className="status-saved">Saved</span>}
          {saveStatus === 'error' && <span className="status-error">Error saving</span>}
        </div>
        <div className="editor-meta">
          <select 
            className="category-select"
            value={selectedNote.category || ''}
            onChange={(e) => updateSelectedNote({ category: e.target.value })}
          >
            <option value="">No Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Idea">Idea</option>
          </select>
        </div>
      </div>

      <div className="editor-body">
        <input
          type="text"
          className="editor-title-input"
          placeholder="Note Title"
          value={title}
          onChange={handleTitleChange}
        />
        <textarea
          className="editor-content-textarea"
          placeholder="Start writing..."
          value={content}
          onChange={handleContentChange}
        />
      </div>
      
      <div className="editor-footer">
        <div className="tags-container">
          <input 
            type="text" 
            className="tags-input" 
            placeholder="Add tags (comma separated)"
            value={selectedNote.tags?.join(', ') || ''}
            onChange={(e) => updateSelectedNote({ tags: e.target.value.split(',').map(t => t.trim()) })}
          />
        </div>
      </div>
    </div>
  );
}
