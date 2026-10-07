import api from './api';

export const userService = {
  // Get current user profile details
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile (e.g. full_name)
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Change user password
  changePassword: async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  },
};
