import {
  USER_LOGGED_OUT,
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
} from "../actions";

const initialState = {
  token: localStorage.getItem("egometer.token"),
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
