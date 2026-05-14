import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import noteService from '../services/noteService';
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

    setNotes([tempNote, ...notes]);
    setSelectedNote(tempNote);
    setView('all'); // Switch to 'all' view when creating

    try {
      const data = await noteService.createNote({ title: '', content: '' });
      if (data.success) {
        setNotes(prev => prev.map(n => n._id === tempId ? data.note : n));
        setSelectedNote(data.note);
      }
    } catch (error) {
      setNotes(prev => prev.filter(n => n._id !== tempId));
      setSelectedNote(null);
      toast.error('Failed to create note');
    }
  };

  const updateSelectedNote = (updates) => {
    if (!selectedNote || selectedNote.isTemp) return;
    
    const updatedNote = { ...selectedNote, ...updates };
    setSelectedNote(updatedNote);
    setNotes(prev => prev.map(n => n._id === selectedNote._id ? updatedNote : n));
    
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await noteService.updateNote(selectedNote._id, updates);
        if (response.success) {
          setSaveStatus('saved');
          setNotes(prev => prev.map(n => n._id === selectedNote._id ? response.note : n));
        }
      } catch (error) {
        setSaveStatus('error');
      }
    }, 1000);
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
      toggleArchive
    }}>
      {children}
    </NoteContext.Provider>
  );
};
