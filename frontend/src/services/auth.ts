import api from './api';

export const authService = {
  async login(username: string, password: string) {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  },
  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
