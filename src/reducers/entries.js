import * as _ from "lodash";
import {
  DELETE_METER_SUCCESS,
  RESET_ENTRIES_ERROR,
  FETCH_ENTRIES_FAILURE,
  FETCH_ENTRIES_REQUEST,
  FETCH_ENTRIES_SUCCESS,
  UPDATE_ENTRY_FAILURE,
  UPDATE_ENTRY_REQUEST,
  UPDATE_ENTRY_SUCCESS,
  DELETE_ENTRY_REQUEST,
  DELETE_ENTRY_FAILURE,
  DELETE_ENTRY_SUCCESS
} from "../actions";

const initialState = {
  entries: {},
  error: undefined,
  loadingStatus: {
    isLoading: false,
    meterId: undefined
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_ENTRIES_ERROR:
      return {
        ...state,
        error: undefined
      };
    case DELETE_ENTRY_REQUEST:
      return {
        ...state,
        error: undefined,
        loadingStatus: {
          isLoading: false,
          entryId: action.entry.id,
          meterId: action.meterId
        }
      };
    case UPDATE_ENTRY_REQUEST:
      return {
        ...state,
        error: undefined,
        loadingStatus: {
          isLoading: false,
          meterId: undefined
        }
      };
    case FETCH_ENTRIES_REQUEST:
      return {
        ...state,
        error: undefined,
        loadingStatus: {
          isLoading: true,
          meterId: action.meterId
        }
      };
    case DELETE_ENTRY_FAILURE:
    case UPDATE_ENTRY_FAILURE:
    case FETCH_ENTRIES_FAILURE:
      return {
        entries: _.cloneDeep(state.entries),
        error: {
          message: action.error,
          meterId: action.meterId
        },
        loadingStatus: {
          isLoading: false,
          meterId: undefined
        }
      };
    case DELETE_ENTRY_SUCCESS:
      const clonedEntries = _.cloneDeep(state.entries);
      const meterEntries = clonedEntries[state.loadingStatus.meterId]
      clonedEntries[state.loadingStatus.meterId] = meterEntries.filter(e => e.id !== state.loadingStatus.entryId)
      return {
        entries: clonedEntries,
        loadingStatus: {
          isLoading: false,
          meterId: undefined,
          entryId: undefined
        }
      };
    case FETCH_ENTRIES_SUCCESS:
      if (state.loadingStatus.isLoading && state.loadingStatus.meterId) {
        // TODO:
        const clonedEntries = _.cloneDeep(state.entries);
        clonedEntries[state.loadingStatus.meterId] =
          action.entries[state.loadingStatus.meterId];
        return {
          // TODO: data accessor necessary
          entries: clonedEntries,
          loadingStatus: {
            isLoading: false,
            meterId: undefined
          }
        };
      }

      return {
        entries: action.entries,
        loadingStatus: {
          isLoading: false,
          meterId: undefined
        }
      };
    case UPDATE_ENTRY_SUCCESS:
      const e = action.entry;
      if (_.has(state.entries, e.meterId)) {
        const clonedState = _.cloneDeep(state);
        const meterEntries = state.entries[e.meterId];
        const idx = _.findIndex(meterEntries, entry => entry.date === e.date);
        const clonedMeterEntries = _.cloneDeep(meterEntries);
        if (idx === -1) {
          clonedMeterEntries.push(e);
        } else {
          clonedMeterEntries[idx] = e;
        }
        clonedState.entries[e.meterId] = clonedMeterEntries;
        return clonedState;
      } else {
        const clone = _.cloneDeep(state.entries);
        clone[e.meterId] = [e];
        return {
          ...state,
          entries: clone
        };
      }
    case DELETE_METER_SUCCESS:
      const meterId = action.meterId;
      if (_.has(state.entries, meterId)) {
        const clonedState = _.cloneDeep(state.entries);
        const filtered = _.omit(clonedState, meterId);
        return {
          ...state,
          entries: filtered
        };
      }
      return state;
    default:
      return state;
  }
};
