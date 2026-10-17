/* eslint-disable no-undef */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import * as api from "../../api";
import {
  clearSession,
  getExpiry,
  getStoredUser,
  getToken,
  isValidToken,
  saveSession,
} from "../../api/session";

const AuthContext = createContext({
  isAuthenticated: false,
  user: undefined,
  login: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logout: () => {},
});

const initialSession = () => {
  const token = getToken();
  if (isValidToken(token)) {
    return { token, user: getStoredUser() };
  }
  clearSession();
  return {};
};

// setTimeout overflows for delays larger than ~24.8 days
const MAX_TIMEOUT = 2 ** 31 - 1;

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(initialSession);

  const logout = useCallback(() => {
    clearSession();
    setSession({});
  }, []);

  const authenticate = useCallback(async (request) => {
    const { data } = await request;
    saveSession(data);
    setSession(data);
    return data.user;
  }, []);

  const login = useCallback(
    (email, password) => authenticate(api.login(email, password)),
    [authenticate]
  );

  const signUp = useCallback(
    (email, password) => authenticate(api.signUp(email, password)),
    [authenticate]
  );

  // log out once the token expires or the API rejects it
  useEffect(() => {
    if (!session.token) {
      return undefined;
    }
    const delay = getExpiry(session.token) - Date.now();
    const timeout = setTimeout(
      logout,
      Math.min(Math.max(delay, 0), MAX_TIMEOUT)
    );
    const unsubscribe = api.onUnauthorized(logout);
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [session.token, logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session.token,
        user: session.user,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => useContext(AuthContext);

export const withAuth = (Component) => {
  const WithAuth = (props) => <Component {...props} auth={useAuth()} />;
  WithAuth.displayName = `WithAuth(${
    Component.displayName || Component.name || "Component"
  })`;
  return WithAuth;
};
