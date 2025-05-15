import axios from 'axios';

const BASE_URL = 'http://13.60.14.34:5001/';
// /';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Do not set withCredentials unless your backend requires cookies
});

// Add request interceptor to add auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const login = async (identifier, password) => {
  try {
    // Validate identifier
    if (!identifier) {
      throw new Error('Email or Mobile number is required');
    }

    const response = await axiosInstance.post('/login', {
      identifier,
      password,
    });

    // Check if the response has the expected structure
    if (response.data && response.data.success) {
      return response.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username, email, mobile, password) => {
  try {
    const response = await axiosInstance.post('/register', {
      username,
      email,
      mobile,
      password,
      role: 'admin',
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const sendOtp = async (mobile_email) => {
  try {
    // Ensure we're sending the correct payload format
    const response = await axiosInstance.post('/send-otp', { mobile_email });
    return response.data;
  } catch (error) {
    console.error('Send OTP error:', error);
    throw error;
  }
};

export const verifyOtp = async (mobile_email, otp) => {
  try {
    // Ensure we're sending the correct payload format
    const response = await axiosInstance.post('/verify-otp', {
      mobile_email,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}; 