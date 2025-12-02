import axiosInstance from '../api/axiosInstance';

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (refreshToken) {
    try {
      await axiosInstance.post(`auth/logout?refreshToken=${refreshToken}`);
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};
