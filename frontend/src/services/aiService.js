import api from './api';

const aiService = {
  generateSummary: async (noteId) => {
    const { data } = await api.post(`/ai/summary/${noteId}`);
    return data;
  },
  extractActionItems: async (noteId) => {
    const { data } = await api.post(`/ai/action-items/${noteId}`);
    return data;
  },
  suggestTitle: async (noteId) => {
    const { data } = await api.post(`/ai/suggest-title/${noteId}`);
    return data;
  },
  suggestTags: async (noteId) => {
    const { data } = await api.post(`/ai/suggest-tags/${noteId}`);
    return data;
  },
  improveWriting: async (noteId) => {
    const { data } = await api.post(`/ai/improve-writing/${noteId}`);
    return data;
  }
};

export default aiService;
