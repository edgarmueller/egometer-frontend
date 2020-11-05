import * as _ from "lodash";
import {
  DELETE_METER_SUCCESS,
  FETCH_METERS_SUCCESS,
  FETCH_METERS_FAILURE,
  UPDATE_METER_SUCCESS,
  FETCH_METERS_REQUEST,
  UPDATE_METER_REQUEST,
  UPDATE_METER_FAILURE,
  RESET_METERS_ERROR,
} from "../actions";

const initialState = {
  error: undefined,
  meters: [],
  isLoading: false,
  updatingStatus: {
    isFetching: false,
    meterId: undefined,
  },
};

const findMeter = (meters, meterId) =>
  _.find(meters, (meter) => meter.id === meterId);

const updateMeterById = (meters, meterId, updateFn) => {
  const m = findMeter(meters, meterId);
  const idx = meters.indexOf(m);
  if (idx === -1) return meters;
  const cloned = meters.slice();
  cloned[idx] = updateFn(m);
  return cloned;
};

export const metersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_METER_REQUEST:
      return {
        ...state,
        error: undefined,
        updatingStatus: {
          isFetching: true,
          meterId: action.meter.id,
        },
      };
    case UPDATE_METER_SUCCESS:
      return {
        error: undefined,
        meters: updateMeterById(
          state.meters,
          action.meter.id,
          () => action.meter
        ),
      };
    case UPDATE_METER_FAILURE:
      return {
        ...state,
        error: {
          message: action.error,
        },
      };
    case FETCH_METERS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case RESET_METERS_ERROR:
      return {
        ...state,
        error: undefined,
      };
    case FETCH_METERS_SUCCESS:
      return {
        error: undefined,
        meters: action.meters,
      };
    case FETCH_METERS_FAILURE:
      return {
        error: action.error,
        meters: [],
      };
    case DELETE_METER_SUCCESS:
      return {
        error: undefined,
        meters: state.meters.filter((meter) => meter.id !== action.meterId),
      };
    default:
      return state;
  }
};

export const findMeterById = (meterId) => (state) =>
  _.find(state.meters, (meter) => meter.id === meterId);
export const getMeters = (state) => state.meters;
export const getMeterError = (state) => state.error;
export const getIsMetersLoading = (state) => state.isLoading;
