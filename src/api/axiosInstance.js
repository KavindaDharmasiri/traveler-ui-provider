import axios from "axios";
import { API_CONFIG } from '../config/environment';

const axiosInstance = axios.create({   
    baseURL: API_CONFIG.BASE_URL,
});

// Request interceptor to add auth headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const tenantId = localStorage.getItem('tenantId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      const tenantId = localStorage.getItem('tenantId');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_CONFIG.BASE_URL}auth/refresh?refreshToken=${refreshToken}`, null, {
            headers: {
              'X-Tenant-Id': tenantId
            }
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;