import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NoteContext } from '../context/NoteContext';
import { toast } from 'react-toastify';
import noteService from '../services/noteService';

export default function Workspace() {
  const location = useLocation();
  const { notes, selectedNote, selectNote, createNote, setView } = useContext(NoteContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    if (location.pathname.includes('/archived')) {
      setView('archived');
    } else {
      setView('active');
    }
  }, [location.pathname, setView]);

  const filteredNotes = notes.filter(n => 
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const titleA = a.title || 'Untitled';
    const titleB = b.title || 'Untitled';
    return sortOrder === 'asc' 
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
  });

  return (
    <div className={`workspace-content ${selectedNote ? 'has-selected-note' : ''}`}>
      {/* Notes List Panel */}
      <div className="notes-list-panel">
        <div className="list-header">
          <div className="list-title-row">
            <h3>All Notes <span className="count">{filteredNotes.length}</span></h3>
            <button 
              className="add-note-btn" 
              onClick={() => {
                console.log('Plus button clicked!');
                createNote();
              }}
            >
              +
            </button>
          </div>
          
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <button className="filter-btn" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
               <span>⇅ Title {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
               <span>▼</span>
            </button>
          </div>
        </div>

        <div className="notes-scroll">
          {filteredNotes.map(note => (
            <div 
              key={note._id} 
              className={`note-card ${selectedNote?._id === note._id ? 'active' : ''}`}
              onClick={() => selectNote(note)}
            >
              <h4>{note.title || 'Untitled'}</h4>
              <p>{note.content?.substring(0, 60) || 'No content yet...'}</p>
              <div className="m-time">just now</div>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="empty-list">No notes found</div>
          )}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="editor-panel">
         <NoteEditor />
      </div>
    </div>
  );
}

function NoteEditor() {
  const { selectedNote, updateSelectedNote, runAiTool, saveStatus, deleteNote, toggleArchive, selectNote } = useContext(NoteContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeAiTab, setActiveAiTab] = useState(null); // 'summary' or 'actionItems'
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
      // If we switch notes, clear the AI tab
      setActiveAiTab(null);
      setIsAddingTag(false);
      setNewTag('');
    }
  }, [selectedNote?._id]);

  if (!selectedNote) {
    return (
      <div className="editor-placeholder">
         <div className="placeholder-icon" style={{ fontSize: '4.5rem', marginBottom: '24px' }}>📝</div>
         <h3>Select a note to start writing</h3>
         <p>Choose an existing note from the sidebar list or create a fresh one to begin typing.</p>
      </div>
    );
  }

  if (selectedNote.isTemp) {
    return (
      <div className="editor-placeholder">
         <div className="spinner"></div>
         <h3>Creating your note...</h3>
      </div>
    );
  }

  const handleUpdate = (updates) => {
    updateSelectedNote(updates);
  };

  const handleRunAiTool = async (tool) => {
    const updates = await runAiTool(tool);
    if (updates) {
      if (updates.content !== undefined) setContent(updates.content);
      if (updates.title !== undefined) setTitle(updates.title);
    }
    if (tool === 'summary') setActiveAiTab('summary');
    if (tool === 'action-items') setActiveAiTab('actionItems');
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      const updatedTags = [...(selectedNote.tags || []), newTag.trim()];
      handleUpdate({ tags: updatedTags });
      setNewTag('');
      setIsAddingTag(false);
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = (selectedNote.tags || []).filter(tag => tag !== tagToRemove);
    handleUpdate({ tags: updatedTags });
  };

  return (
    <>
      <div className="editor-toolbar">
         <div className="toolbar-left">
           <button className="mobile-back-btn" onClick={() => selectNote(null)}>
             ← Back
           </button>
           <span className="save-indicator">● {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'ai-processing' ? 'AI thinking...' : 'Saved'}</span>
         </div>
         <div className="toolbar-right" style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}>
            <button className="action-btn share" onClick={() => setShowShareMenu(!showShareMenu)}>🔗 Share</button>
            {showShareMenu && (
              <div className="share-menu" style={{
                position: 'absolute',
                top: '100%',
                right: '100px',
                marginTop: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-main)',
                borderRadius: '8px',
                padding: '12px',
                zIndex: 50,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '200px'
              }}>
                <h4 style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-muted)' }}>Share this note</h4>
                <button 
                  className="action-btn share" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={async () => {
                    try {
                      let currentShareId = selectedNote.shareId;
                      // Only hit the backend if it's not already public
                      if (!selectedNote.isPublic || !currentShareId) {
                         const response = await noteService.shareNote(selectedNote._id, true);
                         if (response.success) {
                           currentShareId = response.note.shareId;
                           updateSelectedNote({ isPublic: true, shareId: currentShareId });
                         }
                      }
                      
                      const link = `${window.location.origin}/shared/${currentShareId}`;
                      await navigator.clipboard.writeText(link);
                      toast.success('Link copied to clipboard!');
                    } catch (error) {
                      toast.error('Failed to generate share link');
                    } finally {
                      setShowShareMenu(false);
                    }
                  }}
                >
                  📋 Copy Link
                </button>
              </div>
            )}
            <button 
              className="action-btn share" 
              onClick={() => {
                toggleArchive(selectedNote._id);
                toast.success(selectedNote.isArchived ? 'Note Unarchived' : 'Note Archived');
              }}
            >
              📦 {selectedNote.isArchived ? 'Unarchive' : 'Archive'}
            </button>
            <button className="action-btn delete" onClick={() => deleteNote(selectedNote._id)}>🗑️ Delete</button>
         </div>
      </div>

      <div className="editor-canvas">
        <input 
          className="editor-title" 
          value={title} 
          onChange={(e) => { setTitle(e.target.value); handleUpdate({ title: e.target.value }); }}
          placeholder="Untitled"
        />
        
        <div className="editor-meta-row">
           {selectedNote.tags?.map((tag, i) => (
             <div key={i} className="meta-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               🏷️ {tag}
               <span 
                 onClick={() => handleRemoveTag(tag)}
                 style={{ cursor: 'pointer', opacity: 0.7, fontSize: '0.8em' }}
               >
                 ✕
               </span>
             </div>
           ))}
           {isAddingTag ? (
             <input
               className="meta-chip"
               style={{ outline: 'none', width: '80px', color: '#fff' }}
               autoFocus
               value={newTag}
               onChange={(e) => setNewTag(e.target.value)}
               onKeyDown={handleAddTag}
               onBlur={() => { setIsAddingTag(false); setNewTag(''); }}
               placeholder="type..."
             />
           ) : (
             <div 
               className="meta-chip" 
               style={{ cursor: 'pointer' }}
               onClick={() => setIsAddingTag(true)}
             >
               + tag
             </div>
           )}
        </div>

        <textarea 
          className="editor-body"
          value={content}
          onChange={(e) => { setContent(e.target.value); handleUpdate({ content: e.target.value }); }}
          placeholder="Start writing your thoughts..."
        />
      </div>

      {/* AI Results Panel — always visible above bottom bar */}
      {activeAiTab && (
        <div className="ai-results-panel">
          {activeAiTab === 'summary' && selectedNote.aiSummary && (
            <div className="ai-summary-box">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <label>✨ AI Summary</label>
                 <button onClick={() => setActiveAiTab(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
              </div>
              <p>{selectedNote.aiSummary}</p>
            </div>
          )}
          {activeAiTab === 'actionItems' && selectedNote.aiActionItems?.length > 0 && (
            <div className="ai-action-box">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <label>📋 Action Items</label>
                 <button onClick={() => setActiveAiTab(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
              </div>
              <ul>
                {selectedNote.aiActionItems.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="ai-bottom-bar">
         <div className="ai-status">
            <span className="icon">✨</span> {saveStatus === 'ai-processing' ? 'AI IS THINKING...' : 'AI ASSISTANT'}
         </div>
         <div className="ai-actions">
            <button className="ai-tool-btn" disabled={saveStatus === 'ai-processing'} onClick={() => handleRunAiTool('summary')}>🪄 Summary</button>
            <button className="ai-tool-btn" disabled={saveStatus === 'ai-processing'} onClick={() => handleRunAiTool('action-items')}>📋 Action items</button>
            <button className="ai-tool-btn" disabled={saveStatus === 'ai-processing'} onClick={() => handleRunAiTool('title')}>H Title</button>
            <button className="ai-tool-btn" disabled={saveStatus === 'ai-processing'} onClick={() => handleRunAiTool('tags')}>🏷️ Tags</button>
            <button className="ai-tool-btn" disabled={saveStatus === 'ai-processing'} onClick={() => handleRunAiTool('improve')}>✍️ Improve</button>
         </div>
      </div>
    </>
  );
}

