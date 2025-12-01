import { NAVIGATION_CONFIG } from '../config/environment';

// Handle auth data from URL parameters and save to localStorage
export const handleAuthFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const authData = {
    accessToken: urlParams.get('accessToken'),
    refreshToken: urlParams.get('refreshToken'),
    tokenType: urlParams.get('tokenType'),
    userId: urlParams.get('userId'),
    email: urlParams.get('email'),
    name: urlParams.get('name'),
    tenantId: urlParams.get('tenantId'),
    type: urlParams.get('type')
  };

  // Save to localStorage if auth data exists
  if (authData.accessToken) {
    Object.entries(authData).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value);
      }
    });
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return authData;
  }
  
  return null;
};

// Check if user is authenticated, redirect to login if not
export const checkAuth = () => {
  const accessToken = localStorage.getItem('accessToken');
  const tenantId = localStorage.getItem('tenantId');
  
  if (!accessToken || !tenantId) {
    window.location.href = NAVIGATION_CONFIG.LOGIN_URL;
    return false;
  }
  
  return true;
};

// Start monitoring localStorage for auth changes
export const startAuthMonitor = () => {
  setInterval(() => {
    checkAuth();
  }, 1000);
};