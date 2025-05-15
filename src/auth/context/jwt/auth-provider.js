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
      user: action.payload.user,
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
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const user = response.data.data;
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
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { accessToken, user } = response.data;
    console.log(user);
    if (user && (user.permissions.includes('super_admin') || user.permissions.includes('admin'))) {
      setSession(accessToken);
      sessionStorage.setItem(PERMISSION_KEY, user.permissions[0]);
    } else throw new Error("User Doesn't have permission");

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, username, mobile) => {
    const data = {
      email,
      password,
      username,
      mobile,
      role: 'Admin',
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

    if (details.user && details.user.role === 'Admin') {
      setSession(details.access_token); // set token in axios
      sessionStorage.setItem(STORAGE_KEY, details.access_token);
      sessionStorage.setItem(PERMISSION_KEY, details.user.role);
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

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
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
      logout,
    }),
    [login, logout, verifyRegisterOtp, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
