import * as _ from "lodash";
import { USER_LOGIN_SUCCESS } from "../actions";
import * as api from "../api";

export const createErrorMsg = msgs => {
  if (!_.isEmpty(msgs)) return _.join(msgs, " ");
  return undefined;
};

export const checkToken = dispatch => {
  const token = localStorage.getItem("egometer.token");
  if (token) {
    api.testToken(token).then(
      () =>
        dispatch({
          type: USER_LOGIN_SUCCESS,
          token
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
