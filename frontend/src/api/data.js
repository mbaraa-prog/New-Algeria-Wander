import axiosInstance from './axios';

const dataService = {
  getHomeData: async () => {
    const response = await axiosInstance.get('home/');
    return response.data;
  },
  getWilayas: async (params = {}) => {
    const response = await axiosInstance.get('wilayas/', { params });
    return response.data;
  },
  getWilayaDetail: async (id) => {
    const response = await axiosInstance.get(`wilayas/${id}/`);
    return response.data;
  },
  getWilayaPlaces: async (id) => {
    const response = await axiosInstance.get(`wilayas/${id}/places/`);
    return response.data;
  },
  getWilayaEvents: async (id) => {
    const response = await axiosInstance.get(`wilayas/${id}/events/`);
    return response.data;
  },
  getWilayaReviews: async (id) => {
    const response = await axiosInstance.get(`wilayas/${id}/reviews/`);
    return response.data;
  },
  getPlaces: async (params = {}) => {
    const response = await axiosInstance.get('places/', { params });
    return response.data;
  },
  getPlaceDetail: async (id) => {
    const response = await axiosInstance.get(`places/${id}/`);
    return response.data;
  },
  getReviews: async (params = {}) => {
    const response = await axiosInstance.get('reviews/', { params });
    return response.data;
  },
  createReview: async (reviewData) => {
    const response = await axiosInstance.post('reviews/', reviewData);
    return response.data;
  },
  getBlogs: async (params = {}) => {
    const response = await axiosInstance.get('blogs/', { params });
    return response.data;
  },
  getBlogDetail: async (id) => {
    const response = await axiosInstance.get(`blogs/${id}/`);
    return response.data;
  },
  createBlog: async (blogData) => {
    const response = await axiosInstance.post('blogs/', blogData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updateBlog: async (id, blogData) => {
    const response = await axiosInstance.patch(`blogs/${id}/`, blogData);
    return response.data;
  },
  deleteBlog: async (id) => {
    await axiosInstance.delete(`blogs/${id}/`);
  },
  getNotifications: async (params = {}) => {
    const response = await axiosInstance.get('notifications/', { params });
    return response.data;
  },
  markNotificationRead: async (id) => {
    const response = await axiosInstance.patch(`notifications/${id}/mark-read/`, { is_read: true });
    return response.data;
  },
};

export default dataService;