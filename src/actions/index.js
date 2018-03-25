import jwtDecode from "jwt-decode";
import _ from "lodash";
import * as api from "../api";

export const FETCH_METERS_REQUEST = "FETCH_METERS_REQUEST";
export const FETCH_METERS_SUCCESS = "FETCH_METERS_SUCCESS";
export const FETCH_METERS_FAILURE = "FETCH_METERS_FAILURE";

export const FETCH_SCHEMAS_REQUEST = "FETCH_SCHEMAS_REQUEST";
export const FETCH_SCHEMAS_SUCCESS = "FETCH_SCHEMAS_SUCCESS";
export const FETCH_SCHEMAS_FAILURE = "FETCH_SCHEMAS_FAILURE";

export const DELETE_METER_SUCCESS = "DELETE_METER_SUCCESS";
export const DELETE_METER_FAILURE = "DELETE_METER_FAILURE";

export const UPDATE_METER_SUCCESS = "UPDATE_METER_SUCCESS";
export const UPDATE_METER_FAILURE = "UPDATE_METER_FAILURE";

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILURE = "USER_LOGIN_FAILURE";

export const setMeters = meters => {
  const mapped = meters.map(({ visualization, ...otherProps }) => ({
    ...otherProps,
    widget: visualization
  }));

  return {
    type: FETCH_METERS_SUCCESS,
    meters: mapped
  };
};

export const setMetersError = error => ({
  type: FETCH_METERS_FAILURE,
  error: error.message
});

export const setSchemas = schemas => ({
  type: FETCH_SCHEMAS_SUCCESS,
  schemas
});

export const setSchemasError = error => ({
  type: FETCH_SCHEMAS_FAILURE,
  error: error.message
});

export const fetchMeters = () => dispatch => {
  dispatch({ type: FETCH_METERS_REQUEST });
  return api.fetchMeters().then(
    resp => {
      return dispatch(setMeters(resp.data));
    },
    error =>
      dispatch({
        type: FETCH_METERS_FAILURE,
        error: error.message
      })
  );
};

export const fetchSchemas = () => dispatch => {
  dispatch({ type: FETCH_SCHEMAS_REQUEST });

  return api
    .fetchSchemas()
    .then(
      resp => dispatch(setSchemas(resp.data)),
      error => dispatch(setSchemasError(error))
    );
};

export const deleteMeter = meterId => dispatch => {
  return api.deleteMeter(meterId).then(
    resp =>
      dispatch({
        type: DELETE_METER_SUCCESS,
        meterId: resp.data.id
      }),
    error =>
      dispatch({
        type: DELETE_METER_FAILURE,
        error
      })
  );
};

export const updateMeter = meter => dispatch => {
  return api.updateMeter(meter).then(
    resp => {
      dispatch({
        type: UPDATE_METER_SUCCESS,
        meter: {
          ...resp.data,
          widget: resp.data.visualization
        }
      });
    },
    error =>
      dispatch({
        type: UPDATE_METER_FAILURE,
        error
      })
  );
};

export const UPDATE_ENTRY_REQUEST = "UPDATE_ENTRY_REQUEST";
export const UPDATE_ENTRY_SUCCESS = "UPDATE_ENTRY_SUCCESS";
export const UPDATE_ENTRY_FAILURE = "UPDATE_ENTRY_FAILURE";

export const updateEntryRequest = (entry, shouldDebounce = false) => {
  return {
    type: UPDATE_ENTRY_REQUEST,
    shouldDebounce,
    entry
  };
};

export const FETCH_ENTRIES_REQUEST = "FETCH_ENTRIES_REQUEST";
export const FETCH_ENTRIES_SUCCESS = "FETCH_ENTRIES_SUCCESS";
export const FETCH_ENTRIES_FAILURE = "FETCH_ENTRIES_FAILURE";

export const RESET_ENTRIES_ERROR = "RESET_ENTRIES_ERROR";

/**
 * Fetch entries for a given month based on the given date.
 *
 * @param date a YYYY-MM-DD formatted day string
 * @param meterId optional meter id, if omitted, data of all meters is fetched
 * @returns {{type: string, date: *, meterId: *}}
 */
export const fetchEntriesPerMonthRequest = (date, meterId = undefined) => ({
  type: FETCH_ENTRIES_REQUEST,
  date,
  meterId
});

export const receiveEntries = entries => ({
  type: FETCH_ENTRIES_SUCCESS,
  entries
});

export const loginWithEmail = (email, password) => dispatch => {
  dispatch({
    type: USER_LOGIN_REQUEST
  });
  return api.loginUser(email, password).then(
    response => {
      const { userId, details } = response.data;
      const decodedToken = jwtDecode(details.token);
      localStorage.setItem("egometer.token", details.token);
      localStorage.setItem("egometer.role", decodedToken.role);
      dispatch({
        type: USER_LOGIN_SUCCESS,
        token: details.token,
        role: _.get(details, "user.role.name"),
        userId
      });
    },
    error => {
      dispatch({
        type: USER_LOGIN_FAILURE,
        error: _.get(error, "response.data.description") || error.message
      });
    }
  );
};

export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const logout = () => dispatch => {
  return api.logout().then(() => {
    localStorage.removeItem("egometer.token");
    localStorage.removeItem("egometer.role");
    dispatch({
      type: USER_LOGGED_OUT
    });
  });
};
