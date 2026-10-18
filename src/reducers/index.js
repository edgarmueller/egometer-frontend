import { combineReducers } from "redux";
import {
  metersReducer,
  getMeters as _getMeters,
  getMeterError as _getMeterError,
  getIsMetersLoading,
} from "./meters";

import { findMeterById as _findMeterById } from "../reducers/meters";
import entriesReducer from "./entries";

const app = combineReducers({
  meters: metersReducer,
  entries: entriesReducer,
});

export default app;

export const getMeters = (state) => _getMeters(state.meters);
export const getMeterError = (state) => _getMeterError(state.meters);
export const findMeterById = (meterId) => (state) =>
  _findMeterById(meterId)(state.meters);

// TODO: rename
export const getEntriesByMeter = (state) => state.entries.entries;

export const getEntriesError = (state) => state.entries.error;
export const isMetersLoading = (state) => getIsMetersLoading(state.meters);
