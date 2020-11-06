import jwtDecode from "jwt-decode";
import {
  USER_LOGGED_OUT,
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
} from "../actions";

const getTokenFromLocalStorage = () => {
  // eslint-disable-next-line no-undef
  const tokenAsString = localStorage.getItem("egometer.token");
  return tokenAsString;
};

const getEmailFromToken = (token) => {
  if (!token) {
    return;
  }
  const decoded = jwtDecode(token);
  return decoded.email;
};

const initialState = {
  token: getTokenFromLocalStorage(),
  email: getEmailFromToken(getTokenFromLocalStorage()),
  isAuthenticated: false,
  isLoading: false,
  isAdmin: false,
};

export default function userUpdate(
  state = initialState,
  { type, token, error, role }
) {
  switch (type) {
    case USER_LOGIN_REQUEST:
      return { ...initialState, isLoading: true };
    case USER_LOGIN_SUCCESS:
      return {
        token,
        email: getEmailFromToken(token),
        isAuthenticated: true,
        isLoading: false,
        isAdmin: role === "admin",
      };
    case USER_LOGGED_OUT:
    case USER_LOGIN_FAILURE:
      return {
        ...initialState,
        error: error,
      };
    default:
      return state;
  }
}
