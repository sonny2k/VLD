import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, account } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      account,
    };
  },
  LOGIN: (state, action) => {
    const { account } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      account,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    account: null,
  }),
  REGISTER: (state, action) => {
    const { account } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      account,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  sendcode: () => Promise.resolve(),
  verifycode: () => Promise.resolve(),
  createuser: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get('/api/user/account/info');
          const { account } = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              account,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              account: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            account: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (phone, password) => {
    const response = await axios.post('/api/user/auth/login', {
      phone,
      password,
    });
    const { accessToken, account } = response.data;
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        account,
      },
    });
  };

  const register = async (phone, password, fname, lname, role) => {
    const response = await axios.post('/api/user/auth/register', {
      phone,
      password,
      fname,
      lname,
      role,
    });
    const { accessToken, account } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        account,
      },
    });
  };

  const sendcode = async (phone) => {
    const response = await axios.post('api/user/auth/sendcode', {
      phone,
    });
  }

  const verifycode = async (phone, code) => {
    const response = await axios.post('api/user/auth/verifycode', {
      phone,
      code,
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        sendcode,
        verifycode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
