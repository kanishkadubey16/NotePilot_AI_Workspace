import api from './api';

const shareService = {
  toggleShare: async (id) => {
    const { data } = await api.patch(`/notes/share/${id}`);
    return data;
  },
  getPublicNote: async (shareId) => {
    const { data } = await api.get(`/notes/shared/${shareId}`);
    return data;
  }
};

export default shareService;
