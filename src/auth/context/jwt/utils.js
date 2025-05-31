// routes
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    console.log('Token validation failed: No token provided');
    return false;
  }
  if (accessToken === 'mock-jwt-token') {
    return true;
  }
  const decoded = jwtDecode(accessToken);
  if (!decoded) {
    console.log('Token validation failed: Could not decode token');
    return false;
  }
  const currentTime = Date.now() / 1000;
  const isValid = decoded.exp > currentTime;
  console.log('Token validation:', {
    decoded,
    currentTime,
    expiryTime: decoded.exp,
    isValid
  });
  return isValid;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  if (!exp) return;

  // Clear any existing interval
  if (window.tokenCheckInterval) {
    clearInterval(window.tokenCheckInterval);
  }

  // Check if token is already expired
  const currentTime = Date.now() / 1000; // Convert to seconds to match JWT exp
  
  if (currentTime >= exp) {
    alert('Token expired');
    localStorage.removeItem('accessToken');
    window.location.href = paths.auth.jwt.login;
    return;
  }

  // Check token expiration every minute
  window.tokenCheckInterval = setInterval(() => {
    const now = Date.now() / 1000; // Convert to seconds to match JWT exp
    if (now >= exp) {
      clearInterval(window.tokenCheckInterval);
      alert('Token expired');
      localStorage.removeItem('accessToken');
      window.location.href = paths.auth.jwt.login;
    }
  }, 60000); // Check every minute
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const decoded = jwtDecode(accessToken);
    console.log(decoded);
    if (decoded && decoded.exp) {
      tokenExpired(decoded.exp);
    }
  } else {
    localStorage.removeItem('accessToken');

    delete axios.defaults.headers.common.Authorization;
  }
};
