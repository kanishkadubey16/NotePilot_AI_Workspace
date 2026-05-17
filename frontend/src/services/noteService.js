import api from './api';

const noteService = {
  getNotes: async () => {
    const { data } = await api.get('/notes');
    return data;
  },
  getNoteById: async (id) => {
    const { data } = await api.get(`/notes/${id}`);
    return data;
  },
  createNote: async (noteData) => {
    try {
      const { data } = await api.post('/notes', noteData);
      return data;
    } catch (error) {
      console.error('noteService.createNote error:', error.response?.status, error.response?.data);
      throw error;
    }
  },
  updateNote: async (id, noteData) => {
    const { data } = await api.patch(`/notes/${id}`, noteData);
    return data;
  },
  deleteNote: async (id) => {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
  },
  archiveNote: async (id) => {
    const { data } = await api.patch(`/notes/archive/${id}`);
    return data;
  },
  searchNotes: async (query) => {
    const { data } = await api.get(`/notes/search?q=${query}`);
    return data;
  },
  shareNote: async (id, isPublic) => {
    const { data } = await api.patch(`/notes/share/${id}`, { isPublic });
    return data;
  }
};

export default noteService;
