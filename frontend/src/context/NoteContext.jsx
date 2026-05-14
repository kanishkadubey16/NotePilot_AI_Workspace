import { createContext, useState, useEffect, useRef } from 'react';
import noteService from '../services/noteService';
import { toast } from 'react-toastify';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); 

  // Ref for handling setTimeout cleanup (Phase 5 requirement)
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

  // Create Note with Optimistic UI Update (Phase 6 requirement)
  const createNote = async () => {
    const tempId = Date.now().toString();
    const tempNote = {
      _id: tempId,
      title: '',
      content: '',
      tags: [],
      updatedAt: new Date().toISOString(),
      isTemp: true // Flag for optimistic state
    };

    // Optimistic Update: add to UI immediately
    setNotes([tempNote, ...notes]);
    setSelectedNote(tempNote);

    try {
      const data = await noteService.createNote({ title: '', content: '' });
      if (data.success) {
        // Replace temp note with real note from server
        setNotes(prev => prev.map(n => n._id === tempId ? data.note : n));
        setSelectedNote(data.note);
      }
    } catch (error) {
      // Rollback on failure
      setNotes(prev => prev.filter(n => n._id !== tempId));
      setSelectedNote(null);
      toast.error('Failed to create note');
    }
  };

  const selectNote = (note) => {
    setSelectedNote(note);
  };

  // Manual trigger for save (used for immediate actions if needed)
  const performSave = async (id, data) => {
    setSaveStatus('saving');
    try {
      const response = await noteService.updateNote(id, data);
      if (response.success) {
        setSaveStatus('saved');
        setNotes(prev => prev.map(n => n._id === id ? response.note : n));
      }
    } catch (error) {
      setSaveStatus('error');
    }
  };

  // Auto-save logic with setTimeout and cleanup (Phase 5 requirement)
  const updateSelectedNote = (updates) => {
    if (!selectedNote || selectedNote.isTemp) return;
    
    // 1. Update local state for immediate feedback
    const updatedNote = { ...selectedNote, ...updates };
    setSelectedNote(updatedNote);
    setNotes(prev => prev.map(n => n._id === selectedNote._id ? updatedNote : n));
    
    // 2. Set status to saving
    setSaveStatus('saving');

    // 3. Cleanup previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 4. Set new timeout for debouncing
    saveTimeoutRef.current = setTimeout(() => {
      performSave(selectedNote._id, updates);
    }, 1500); // 1.5s delay after typing stops
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <NoteContext.Provider value={{
      notes,
      selectedNote,
      loading,
      saveStatus,
      fetchNotes,
      createNote,
      selectNote,
      updateSelectedNote,
      deleteNote: async (id) => {
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
      }
    }}>
      {children}
    </NoteContext.Provider>
  );
};
