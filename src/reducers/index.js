import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import {
  metersReducer,
  getMeters as _getMeters,
  getMeterError as _getMeterError,
  getIsMetersLoading,
} from "./meters";
import {
  findBySchemaName as _findBySchemaName,
  getSchemaError as _getSchemaError,
  getIsSchemasLoading,
} from "./schemas";

import { findMeterById as _findMeterById } from "../reducers/meters";
import schemaReducer from "./schemas";
import entriesReducer from "./entries";

const app = combineReducers({
  router: routerReducer,
  meters: metersReducer,
  schemas: schemaReducer,
  entries: entriesReducer,
});

export default app;

export const getMeters = (state) => _getMeters(state.meters);
export const getMeterError = (state) => _getMeterError(state.meters);
export const findMeterById = (meterId) => (state) =>
  _findMeterById(meterId)(state.meters);

export const getSchemas = (state) => state.schemas.schemas;
export const getSchemaError = (state) => _getSchemaError(state.schemas);
export const findBySchemaName = (schemaName) => (state) =>
  _findBySchemaName(schemaName)(state.schemas);
// TODO: rename
export const getEntriesByMeter = (state) => state.entries.entries;

export const getEntriesError = (state) => state.entries.error;
export const isSchemasLoading = (state) => getIsSchemasLoading(state.schemas);
export const isMetersLoading = (state) => getIsMetersLoading(state.meters);
