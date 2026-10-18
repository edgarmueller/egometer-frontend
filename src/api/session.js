/* eslint-disable no-undef */
import jwtDecode from "jwt-decode";

const TOKEN_KEY = "egometer.token";
const USER_KEY = "egometer.user";

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return undefined;
  }
};

export const getToken = () => read(TOKEN_KEY) || undefined;

export const getStoredUser = () => {
  try {
    return JSON.parse(read(USER_KEY)) || undefined;
  } catch (e) {
    return undefined;
  }
};

/**
 * Returns the expiry date of the token in ms, or undefined if the
 * token can't be decoded.
 */
export const getExpiry = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp ? exp * 1000 : undefined;
  } catch (e) {
    return undefined;
  }
};

export const isValidToken = (token) => {
  const expiry = getExpiry(token);
  return !!token && expiry !== undefined && expiry > Date.now();
};

export const saveSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
