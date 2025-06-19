import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { PERMISSION_KEY } from 'src/utils/constants';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
  otpResult: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: null,
      otpResult: action.payload.result,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: null,
      otpResult: action.payload.result,
    };
  }
  if (action.type === 'VERIFY_REGISTER_OTP') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'VERIFY_FORGOT_PASSWORD_OTP') {
    return {
      ...state,
      otpResult: action.payload.otpResult,
    };
  }
  if (action.type === 'VERIFY_LOGIN_OTP') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const user = response.data.data;
        console.log(user);
        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (identifier, password) => {
    const data = {
      identifier,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const result = response.data;

    dispatch({
      type: 'LOGIN',
      payload: {
        otpResult: result,
      },
    });
    return result;
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, username, mobile) => {
    const data = {
      email,
      password,
      username,
      mobile,
      role: 'admin',
    };

    const response = await axios.post(endpoints.auth.register, data);

    const result = response.data;

    dispatch({
      type: 'REGISTER',
      payload: {
        user: null,
        otpResult: result,
      },
    });
    return result;
  }, []);

  // VERIFY REGISTER OTP
  const verifyRegisterOtp = useCallback(async (email, email_otp, mobile, mobile_otp) => {
    const data = {
      email,
      email_otp,
      mobile,
      mobile_otp,
    };

    const response = await axios.post(endpoints.auth.verifyRegisterOtp, data);

    const { data: details } = response.data;

    if (details.user && (details.user.role === 'admin' || details.user.role === 'super_admin')) {
      setSession(details.access_token); // set token in axios
      localStorage.setItem(STORAGE_KEY, details.access_token);
      localStorage.setItem(PERMISSION_KEY, details.user.role);
    } else {
      throw new Error("User doesn't have permission");
    }

    dispatch({
      type: 'VERIFY_REGISTER_OTP',
      payload: {
        user: details.user,
      },
    });
  }, []);

  // VERIFY LOGIN OTP
  const verifyLoginOtp = useCallback(async (mobile_email, otp, remember_me = false) => {
    const data = {
      mobile_email,
      otp,
      remember_me,
    };

    const response = await axios.post(endpoints.auth.verifyLoginOtp, data);

    const { data: details } = response.data;
    console.log(details);
    if (details.user && (details.user.role === 'admin' || details.user.role === 'super_admin')) {
      setSession(details.access_token); // set token in axios
      localStorage.setItem(STORAGE_KEY, details.access_token);
      localStorage.setItem(PERMISSION_KEY, details.user.role);
    } else {
      throw new Error("User doesn't have permission");
    }

    dispatch({
      type: 'VERIFY_LOGIN_OTP',
      payload: {
        user: details.user,
      },
    });
  }, []);

  // VERIFY FORGOT PASSWORD OTP
  const verifyForgotPasswordOtp = useCallback(async (mobile_email, otp) => {
    const data = {
      mobile_email,
      otp,
    };

    const response = await axios.post(endpoints.auth.verifyLoginOtp, data);

    const { data: details } = response.data;
    console.log(details);

    dispatch({
      type: 'VERIFY_FORGOT_PASSWORD_OTP',
      payload: {
        otpResult: details,
      },
    });
    return details;
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // for google login
  const googleLogin = useCallback(async (accessToken, userProfile) => {
    console.log('Logging with google');
    localStorage.setItem(STORAGE_KEY, accessToken);
    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: userProfile,
      },
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      verifyRegisterOtp,
      initialize,
      verifyLoginOtp,
      verifyForgotPasswordOtp,
      logout,
      googleLogin,
    }),
    [
      login,
      logout,
      initialize,
      verifyRegisterOtp,
      verifyLoginOtp,
      verifyForgotPasswordOtp,
      register,
      state.user,
      status,
      googleLogin
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
