import { useState, useContext } from 'react';
import { NoteContext } from '../context/NoteContext';
import aiService from '../services/aiService';
import { toast } from 'react-toastify';

export default function AIPanel() {
  const { selectedNote, updateSelectedNote, runAiTool } = useContext(NoteContext);
  const [loading, setLoading] = useState(null);
  const [results, setResults] = useState({
    summary: '',
    actionItems: [],
    suggestedTags: [],
    writingSuggestion: ''
  });

  if (!selectedNote) return null;

  const handleAIAction = async (type, actionFn, resultKey) => {
    if (!selectedNote.content) {
      return toast.warning('Add some content first to use AI features!');
    }
    
    setLoading(type);
    try {
      const data = await actionFn(selectedNote._id);
      console.log(`[AIPanel] ${type} response:`, data);
      if (data.success) {
        // Store in local results for immediate display
        const resultValue = type === 'summary' ? data.summary :
                           type === 'actionItems' ? data.actionItems :
                           type === 'tags' ? data.tags :
                           type === 'title' ? data.title :
                           type === 'improve' ? data.suggestions : null;
        
        setResults(prev => ({ ...prev, [resultKey]: resultValue }));
        
        // Persist to selectedNote context
        if (type === 'summary') updateSelectedNote({ aiSummary: data.summary });
        if (type === 'actionItems') updateSelectedNote({ aiActionItems: data.actionItems });
        if (type === 'title') {
          updateSelectedNote({ title: data.title });
          toast.success('Title updated by AI');
        }
        
        toast.success(`${type === 'actionItems' ? 'Action items' : type.charAt(0).toUpperCase() + type.slice(1)} generated!`);
      }
    } catch (error) {
      console.error(`[AIPanel] ${type} error:`, error);
      toast.error(error.response?.data?.message || `Failed to generate ${type}`);
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard');
  };

  const applyTags = (tags) => {
    const currentTags = selectedNote.tags || [];
    const newTags = [...new Set([...currentTags, ...tags])];
    updateSelectedNote({ tags: newTags });
    setResults(prev => ({ ...prev, suggestedTags: [] }));
    toast.success('Tags added');
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>✨ AI Assistant</h3>
        <p>Enhance your notes with Gemini AI</p>
      </div>

      <div className="ai-tools-grid">
        <button 
          className="ai-tool-btn" 
          disabled={loading}
          onClick={() => handleAIAction('summary', aiService.generateSummary, 'summary')}
        >
          {loading === 'summary' ? 'Summarizing...' : '📝 Summarize'}
        </button>
        <button 
          className="ai-tool-btn" 
          disabled={loading}
          onClick={() => handleAIAction('actionItems', aiService.extractActionItems, 'actionItems')}
        >
          {loading === 'actionItems' ? 'Analyzing...' : '✅ Action Items'}
        </button>
        <button 
          className="ai-tool-btn" 
          disabled={loading}
          onClick={() => handleAIAction('title', aiService.suggestTitle, 'title')}
        >
          {loading === 'title' ? 'Suggesting...' : '🏷️ Smart Title'}
        </button>
        <button 
          className="ai-tool-btn" 
          disabled={loading}
          onClick={() => handleAIAction('tags', aiService.suggestTags, 'suggestedTags')}
        >
          {loading === 'tags' ? 'Finding tags...' : '🏷️ Suggest Tags'}
        </button>
        <button 
          className="ai-tool-btn" 
          disabled={loading}
          onClick={() => handleAIAction('improve', aiService.improveWriting, 'writingSuggestion')}
        >
          {loading === 'improve' ? 'Improving...' : '✍️ Improve Writing'}
        </button>
      </div>

      <div className="ai-results-container">
        {/* Summary Result */}
        {(results.summary || selectedNote.aiSummary) && (
          <div className="ai-result-card">
            <div className="card-header">
              <span>AI Summary</span>
              <button onClick={() => copyToClipboard(results.summary || selectedNote.aiSummary)}>📋</button>
            </div>
            <p>{results.summary || selectedNote.aiSummary}</p>
          </div>
        )}

        {/* Action Items Result */}
        {(results.actionItems.length > 0 || selectedNote.aiActionItems?.length > 0) && (
          <div className="ai-result-card">
            <div className="card-header">
              <span>Action Items</span>
              <button onClick={() => copyToClipboard((results.actionItems || selectedNote.aiActionItems).join('\n'))}>📋</button>
            </div>
            <ul className="ai-checklist">
              {(results.actionItems.length > 0 ? results.actionItems : selectedNote.aiActionItems).map((item, i) => (
                <li key={i}><span>☐</span> {item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested Tags Result */}
        {results.suggestedTags.length > 0 && (
          <div className="ai-result-card">
            <div className="card-header">
              <span>Suggested Tags</span>
              <button className="apply-btn" onClick={() => applyTags(results.suggestedTags)}>Add All</button>
            </div>
            <div className="suggested-tags-list">
              {results.suggestedTags.map(tag => (
                <span key={tag} className="suggested-tag">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Writing Suggestion Result */}
        {results.writingSuggestion && (
          <div className="ai-result-card">
            <div className="card-header">
              <span>Writing Suggestion</span>
              <button onClick={() => copyToClipboard(results.writingSuggestion)}>📋</button>
            </div>
            <p className="writing-preview">{results.writingSuggestion}</p>
            <button 
                className="apply-full-btn"
                onClick={() => {
                    updateSelectedNote({ content: results.writingSuggestion });
                    setResults(prev => ({ ...prev, writingSuggestion: '' }));
                    toast.success('Writing improved!');
                }}
            >
                Apply Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
