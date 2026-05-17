import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import noteService from '../services/noteService';
import aiService from '../services/aiService';
import { toast } from 'react-toastify';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  
  // Filtering and Searching State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState('all'); // 'all', 'archived'

  const saveTimeoutRef = useRef(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await noteService.getNotes();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  // Filtered Notes Logic
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || note.category === activeCategory;
      
      const matchesView = view === 'archived' ? note.isArchived : !note.isArchived;

      return matchesSearch && matchesCategory && matchesView;
    });
  }, [notes, searchQuery, activeCategory, view]);

  const createNote = async () => {
    console.log('Creating note...');
    const tempId = Date.now().toString();
    const tempNote = {
      _id: tempId,
      title: '',
      content: '',
      tags: [],
      category: '',
      isArchived: false,
      updatedAt: new Date().toISOString(),
      isTemp: true
    };

    setNotes(prev => [tempNote, ...prev]);
    setSelectedNote(tempNote);
    setView('all'); 
    setSearchQuery('');
    setActiveCategory('All');

    try {
      const data = await noteService.createNote({ title: '', content: '' });
      if (data.success) {
        setNotes(prev => prev.map(n => n._id === tempId ? data.note : n));
        setSelectedNote(data.note);
        toast.success('New note created');
      }
    } catch (error) {
      setNotes(prev => prev.filter(n => n._id !== tempId));
      setSelectedNote(null);
      toast.error('Failed to create note');
    }
  };

  const pendingUpdatesRef = useRef({});

  const updateSelectedNote = (updates) => {
    if (!selectedNote || selectedNote.isTemp) return;
    
    const noteIdToSave = selectedNote._id;
    const updatedNote = { ...selectedNote, ...updates };
    setSelectedNote(updatedNote);
    setNotes(prev => prev.map(n => n._id === noteIdToSave ? updatedNote : n));
    
    // Accumulate all field updates for this specific note
    pendingUpdatesRef.current[noteIdToSave] = {
      ...(pendingUpdatesRef.current[noteIdToSave] || {}),
      ...updates
    };
    
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      const updatesToSend = pendingUpdatesRef.current[noteIdToSave];
      if (!updatesToSend) return;
      delete pendingUpdatesRef.current[noteIdToSave];

      try {
        const response = await noteService.updateNote(noteIdToSave, updatesToSend);
        if (response.success) {
          setSaveStatus('saved');
          // Merge server response with current local state to preserve AI fields
          setNotes(prev => prev.map(n => n._id === noteIdToSave ? { ...n, ...response.note } : n));
          setSelectedNote(prev => prev?._id === noteIdToSave ? { ...prev, ...response.note } : prev);

          // Auto-suggest tags if the setting is on and content was updated
          const autoSuggest = localStorage.getItem('autoSuggestTags') === 'true';
          if (autoSuggest && updatesToSend.content) {
            try {
              const aiData = await aiService.suggestTags(noteIdToSave);
              if (aiData.success && aiData.tags?.length > 0) {
                const tagUpdate = { tags: aiData.tags };
                await noteService.updateNote(noteIdToSave, tagUpdate);
                setNotes(prev => prev.map(n => n._id === noteIdToSave ? { ...n, ...tagUpdate } : n));
                setSelectedNote(prev => prev?._id === noteIdToSave ? { ...prev, ...tagUpdate } : prev);
              }
            } catch (_) {
              // silently fail tag suggestion - don't bother the user
            }
          }
        }
      } catch (error) {
        setSaveStatus('error');
      }
    }, 1500);
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this note?')) return;
    
    try {
      const data = await noteService.deleteNote(id);
      if (data.success) {
        setNotes(prev => prev.filter(n => n._id !== id));
        if (selectedNote?._id === id) setSelectedNote(null);
        toast.success('Note deleted');
      }
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const toggleArchive = async (id) => {
    try {
      const data = await noteService.archiveNote(id);
      if (data.success) {
        setNotes(prev => prev.map(n => n._id === id ? data.note : n));
        if (selectedNote?._id === id) setSelectedNote(data.note);
        toast.success(data.note.isArchived ? 'Note archived' : 'Note unarchived');
      }
    } catch (error) {
      toast.error('Failed to update archive status');
    }
  };

  const applyAiResult = (updates) => {
    console.log('[AI] applyAiResult called with:', updates);
    setSelectedNote(prev => {
      const next = prev ? { ...prev, ...updates } : prev;
      console.log('[AI] selectedNote after update:', next);
      return next;
    });
    setNotes(prev => prev.map(n => n._id === selectedNote._id ? { ...n, ...updates } : n));
  };

  const runAiTool = async (toolName) => {
    if (!selectedNote || selectedNote.isTemp) return null;
    
    setSaveStatus('ai-processing');
    try {
      let data;
      switch (toolName) {
        case 'summary':
          data = await aiService.generateSummary(selectedNote._id);
          console.log('[AI] summary response:', data);
          if (data.success) {
            applyAiResult({ aiSummary: data.summary });
            toast.success('Summary generated!');
            return { aiSummary: data.summary };
          }
          break;
        case 'action-items':
          data = await aiService.extractActionItems(selectedNote._id);
          console.log('[AI] action-items response:', data);
          if (data.success) {
            applyAiResult({ aiActionItems: data.actionItems });
            toast.success('Action items extracted!');
            return { aiActionItems: data.actionItems };
          }
          break;
        case 'title':
          data = await aiService.suggestTitle(selectedNote._id);
          if (data.success) {
            applyAiResult({ title: data.title });
            toast.success('Title updated!');
            return { title: data.title };
          }
          break;
        case 'tags':
          data = await aiService.suggestTags(selectedNote._id);
          if (data.success) {
            applyAiResult({ tags: data.tags });
            toast.success('Tags suggested!');
            return { tags: data.tags };
          }
          break;
        case 'improve':
          data = await aiService.improveWriting(selectedNote._id);
          if (data.success) {
            applyAiResult({ content: data.suggestions || data.content }); // backend aiService returns suggestions
            toast.success('Writing improved!');
            return { content: data.suggestions || data.content };
          }
          break;
        default:
          break;
      }
      return null;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'AI processing failed. Please check your API key.';
      toast.error(errorMsg);
      return null;
    } finally {
      setSaveStatus('saved');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <NoteContext.Provider value={{
      notes: filteredNotes,
      allNotes: notes, // For tag/category extraction
      selectedNote,
      loading,
      saveStatus,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      view,
      setView,
      createNote,
      selectNote: setSelectedNote,
      updateSelectedNote,
      deleteNote,
      toggleArchive,
      runAiTool
    }}>
      {children}
    </NoteContext.Provider>
  );
};
