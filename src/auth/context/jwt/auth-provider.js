import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import { login as loginApi, register as registerApi, sendOtp as sendOtpApi, verifyOtp as verifyOtpApi } from 'src/api/auth';
import { useLocales } from 'src/locales';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
  isOtpVerified: false,
  pendingVerification: null, // Stores the identifier (email/phone) pending verification
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
      isOtpVerified: action.payload.isOtpVerified || false,
      pendingVerification: null,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
      isOtpVerified: false,
      pendingVerification: action.payload.identifier,
    };
  }
  if (action.type === 'VERIFY_OTP') {
    return {
      ...state,
      isOtpVerified: true,
      pendingVerification: null,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
      pendingVerification: null,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
      isOtpVerified: false,
      pendingVerification: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

// Helper to get token from either storage
function getStoredToken() {
  return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
}

// Helper to set token: always sessionStorage, and localStorage if rememberMe
function setStoredToken(token, rememberMe) {
  if (token) {
    sessionStorage.setItem(STORAGE_KEY, token);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useLocales();

  const initialize = useCallback(async () => {
    try {
      const accessToken = getStoredToken();
      console.log('Initializing auth with token:', {
        hasToken: !!accessToken,
        tokenSource: localStorage.getItem(STORAGE_KEY) ? 'localStorage' : 'sessionStorage',
        isValid: accessToken ? isValidToken(accessToken) : false
      });

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // Get user data from token
        const decoded = JSON.parse(atob(accessToken.split('.')[1]));
        const user = {
          id: decoded.user_id,
          displayName: decoded.username,
          email: decoded.email,
          role: decoded.role,
          isEmailVerified: decoded.is_email_verified,
          isMobileVerified: decoded.is_mobile_verified,
          mobile: decoded.mobile,
        };

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
            isOtpVerified: true,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
            isOtpVerified: false,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
          isOtpVerified: false,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (identifier, password, rememberMe) => {
    try {
      const response = await loginApi(identifier, password);
      
      if (response.success && response.data) {
        const { data } = response;
        
        // Check if the login method matches the identifier type
        const isEmail = identifier.includes('@');
        const loginMethod = isEmail ? 'email' : 'mobile';
        
        if (data.login_method !== loginMethod) {
          throw new Error(t('login_user_not_found'));
        }

        // Store user data temporarily without setting session
        const user = {
          id: data.user_id,
          displayName: data.username,
          email: data.email,
          role: data.role,
          isEmailVerified: data.is_email_verified,
          isMobileVerified: data.is_mobile_verified,
          mobile: data.mobile,
        };

        // Send OTP to the login method (email or phone)
        try {
          await sendOtpApi(identifier);
        } catch (otpError) {
          console.error('Error sending OTP:', otpError);
          throw new Error('Failed to send verification OTP');
        }

        // Set pending verification state
        dispatch({
          type: 'LOGIN',
          payload: {
            user,
            identifier,
          },
        });

        return {
          success: true,
          user,
          message: `Please verify your ${isEmail ? 'email' : 'phone number'} to continue`
        };
      }
      throw new Error(response.message || t('login_user_not_found'));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [t]);

  // SEND OTP
  const sendOtp = useCallback(async (identifier) => {
    try {
      const response = await sendOtpApi(identifier);
      if (response.success) {
        return {
          success: true,
          message: 'OTP sent successfully'
        };
      }
      throw new Error(response.message || 'Failed to send OTP');
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }, []);

  // VERIFY OTP
  const verifyOtp = useCallback(async (identifier, otp) => {
    try {
      const response = await verifyOtpApi(identifier, otp);
      
      if (response.success && response.data) {
        const { data } = response;
        
        if (data.verified) {
          // Set session and token after successful verification
          setSession(data.accessToken);
          setStoredToken(data.accessToken, true);
          
          dispatch({
            type: 'VERIFY_OTP',
            payload: {
              isEmailVerified: identifier.includes('@'),
              isMobileVerified: !identifier.includes('@'),
            },
          });

          return {
            success: true,
            message: 'OTP verified successfully'
          };
        }
      }
      throw new Error(response.message || 'OTP verification failed');
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }, []);

  // REGISTER
  const register = useCallback(async (username, email, mobile, password) => {
    try {
      const response = await registerApi(username, email, mobile, password);
      const { data } = response;

      if (data.user_id) {
        // After successful registration, send OTP to both email and mobile
        try {
          await Promise.all([
            sendOtpApi(email),
            sendOtpApi(mobile),
          ]);
        } catch (otpError) {
          console.error('Error sending OTPs:', otpError);
          // Continue with registration even if OTP sending fails
        }

        // Don't set user in state or tokens - wait for OTP verification
        return {
          success: true,
          message: 'Registration successful. Please verify your email and phone number.'
        };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    setStoredToken(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      isOtpVerified: state.isOtpVerified,
      pendingVerification: state.pendingVerification,
      authenticated: !!state.user,
      method: 'jwt',
      login,
      register,
      verifyOtp,
      logout,
    }),
    [state.user, state.loading, state.isOtpVerified, state.pendingVerification, login, register, verifyOtp, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
