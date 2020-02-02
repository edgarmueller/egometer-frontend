import { USER_LOGIN_SUCCESS } from "../actions";
import * as api from "../api";

export const checkToken = dispatch => {
  const token = localStorage.getItem("egometer.token");
  const role = localStorage.getItem("egometer.role");
  if (token) {
    api.testToken(token).then(
      () =>
        dispatch({
          type: USER_LOGIN_SUCCESS,
          token,
          role
        }),
      () => {
        console.log("Token outdated, removing it.", token);
        localStorage.removeItem("egometer.token");
        localStorage.removeItem("egometer.role");
      }
    );
  } else {
    localStorage.removeItem("egometer.role");
  }
};
