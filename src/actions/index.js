import * as api from "../api";

export const FETCH_METERS_REQUEST = "FETCH_METERS_REQUEST";
export const FETCH_METERS_SUCCESS = "FETCH_METERS_SUCCESS";
export const FETCH_METERS_FAILURE = "FETCH_METERS_FAILURE";

export const FETCH_SCHEMAS_REQUEST = "FETCH_SCHEMAS_REQUEST";
export const FETCH_SCHEMAS_SUCCESS = "FETCH_SCHEMAS_SUCCESS";
export const FETCH_SCHEMAS_FAILURE = "FETCH_SCHEMAS_FAILURE";

export const RESET_METERS_ERROR = "RESET_METERS_ERROR";

export const DELETE_METER_SUCCESS = "DELETE_METER_SUCCESS";
export const DELETE_METER_FAILURE = "DELETE_METER_FAILURE";

export const UPDATE_METER_REQUEST = "UPDATE_METER_REQUEST";
export const UPDATE_METER_SUCCESS = "UPDATE_METER_SUCCESS";
export const UPDATE_METER_FAILURE = "UPDATE_METER_FAILURE";

export const setMeters = (meters) => {
  const mapped = meters.map(({ widget, ...otherProps }) => ({
    ...otherProps,
    widget,
  }));

  return {
    type: FETCH_METERS_SUCCESS,
    meters: mapped,
  };
};

export const setMetersError = (error) => ({
  type: FETCH_METERS_FAILURE,
  error: error.message,
});

export const resetMetersError = () => ({
  type: RESET_METERS_ERROR,
});

export const setSchemas = (schemas) => ({
  type: FETCH_SCHEMAS_SUCCESS,
  schemas,
});

export const setSchemasError = (error) => ({
  type: FETCH_SCHEMAS_FAILURE,
  error: error.message,
});

export const fetchMeters = () => (dispatch) => {
  dispatch({ type: FETCH_METERS_REQUEST });
  return api.fetchMeters().then(
    (resp) => {
      return dispatch(setMeters(resp.data));
    },
    (error) =>
      dispatch({
        type: FETCH_METERS_FAILURE,
        error: error.message,
      })
  );
};

export const fetchSchemas = () => (dispatch) => {
  dispatch({ type: FETCH_SCHEMAS_REQUEST });

  return api.fetchSchemas().then(
    (resp) => dispatch(setSchemas(resp.data)),
    (error) => dispatch(setSchemasError(error))
  );
};

export const deleteMeter = (meterId) => (dispatch) => {
  return api.deleteMeter(meterId).then(
    (resp) =>
      dispatch({
        type: DELETE_METER_SUCCESS,
        meterId: resp.data.id,
      }),
    (error) =>
      dispatch({
        type: DELETE_METER_FAILURE,
        error,
      })
  );
};

export const updateMeter = (meter) => (dispatch) => {
  return api.updateMeter(meter).then(
    (resp) => {
      dispatch({
        type: UPDATE_METER_SUCCESS,
        meter: {
          ...resp.data,
          widget: resp.data.visualization,
        },
      });
    },
    (error) =>
      dispatch({
        type: UPDATE_METER_FAILURE,
        error,
      })
  );
};

export const UPDATE_ENTRY_REQUEST = "UPDATE_ENTRY_REQUEST";
export const UPDATE_ENTRY_SUCCESS = "UPDATE_ENTRY_SUCCESS";
export const UPDATE_ENTRY_FAILURE = "UPDATE_ENTRY_FAILURE";

export const DELETE_ENTRY_REQUEST = "DELETE_ENTRY_REQUEST";
export const DELETE_ENTRY_SUCCESS = "DELETE_ENTRY_SUCCESS";
export const DELETE_ENTRY_FAILURE = "DELETE_ENTRY_FAILURE";

export const updateEntryRequest = (entry, shouldDebounce = false) => {
  return {
    type: UPDATE_ENTRY_REQUEST,
    shouldDebounce,
    entry,
  };
};

export const deleteEntryRequest = (meterId, entry, shouldDebounce = false) => {
  return {
    type: DELETE_ENTRY_REQUEST,
    shouldDebounce,
    meterId,
    entry,
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
export const fetchEntriesRequest = (year, month, meterId = undefined) => ({
  type: FETCH_ENTRIES_REQUEST,
  year,
  month,
  meterId,
});

export const fetchEntriesRequestByWeek = (year, week, meterId = undefined) => ({
  type: FETCH_ENTRIES_REQUEST,
  year,
  week,
  meterId,
});

export const updateMeterRequest = (meter) => ({
  type: UPDATE_METER_REQUEST,
  meter,
});

export const receiveEntries = (entries) => ({
  type: FETCH_ENTRIES_SUCCESS,
  entries,
});
