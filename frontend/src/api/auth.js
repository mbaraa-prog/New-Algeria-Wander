import axiosInstance from './axios';

const authService = {
  login: async (email, password, remember_me = false) => {
    const response = await axiosInstance.post('auth/login/', {
      email,
      password,
      remember_me,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('auth/register/', userData);
    return response.data;
  },

  logout: async (refresh) => {
    const response = await axiosInstance.post('auth/logout/', { refresh });
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('auth/profile/');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axiosInstance.put('auth/profile/', userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  refreshToken: async (refresh) => {
    const response = await axiosInstance.post('auth/token/refresh/', { refresh });
    return response.data;
  },
};

export default authService;
