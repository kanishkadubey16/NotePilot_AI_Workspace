import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import shareService from '../services/shareService';
import '../styles/workspace.css';

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const data = await shareService.getPublicNote(shareId);
        if (data.success) {
          setNote(data.note);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSharedNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className="shared-note-loading">
        <div className="spinner"></div>
        <p>Opening shared note...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="shared-note-error">
        <div className="error-content">
          <h1>404</h1>
          <h3>Note not found</h3>
          <p>This note may have been deleted or its sharing has been disabled by the owner.</p>
          <Link to="/" className="back-home-btn">Go to NotePilot AI</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-note-page">
      <nav className="shared-nav">
        <div className="shared-logo">🚀 NotePilot AI</div>
        <div className="shared-badge">Publicly Shared</div>
      </nav>

      <main className="shared-content-container">
        <header className="shared-header">
           <div className="shared-meta">
             <span className="shared-category">{note.category}</span>
             <span className="shared-date">Last updated {new Date(note.updatedAt).toLocaleDateString()}</span>
           </div>
           <h1 className="shared-title">{note.title || 'Untitled Note'}</h1>
           <div className="shared-tags">
             {note.tags?.map(tag => <span key={tag} className="shared-tag">#{tag}</span>)}
           </div>
        </header>

        <section className="shared-body">
          {note.content ? (
            <div className="content-render">
              {note.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="empty-content">No content provided.</p>
          )}
        </section>

        {(note.aiSummary || note.aiActionItems?.length > 0) && (
          <aside className="shared-ai-insights">
            {note.aiSummary && (
              <div className="insight-section">
                <label>AI Summary</label>
                <p>{note.aiSummary}</p>
              </div>
            )}
            {note.aiActionItems?.length > 0 && (
              <div className="insight-section">
                <label>Action Items</label>
                <ul>
                  {note.aiActionItems.map((item, i) => <li key={i}>✅ {item}</li>)}
                </ul>
              </div>
            )}
          </aside>
        )}
      </main>

      <footer className="shared-footer">
        <p>Created with <strong>NotePilot AI</strong> — The smarter way to take notes.</p>
      </footer>
    </div>
  );
}
