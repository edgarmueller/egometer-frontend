import jwtDecode from "jwt-decode";
import { USER_LOGIN_SUCCESS } from "../actions";

// TODO: duplicate
const hasValidToken = (token) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);
  return decoded.exp > new Date().getTime() / 1000;
};

export const checkToken = (dispatch) => {
  const token = localStorage.getItem("egometer.token");
  const role = localStorage.getItem("egometer.role");
  if (token) {
    const isValid = hasValidToken(token);
    if (isValid) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        token,
        role,
      });
    } else {
      console.log("Token outdated, removing it.", token);
      localStorage.removeItem("egometer.token");
      localStorage.removeItem("egometer.role");
    }
  } else {
    localStorage.removeItem("egometer.role");
  }
};
