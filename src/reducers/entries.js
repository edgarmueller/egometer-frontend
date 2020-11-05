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
  DELETE_ENTRY_SUCCESS,
} from "../actions";

const initialState = {
  entries: {},
  error: undefined,
  loadingStatus: {
    isLoading: false,
    meterId: undefined,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DELETE_ENTRY_REQUEST:
    case UPDATE_ENTRY_REQUEST:
    case RESET_ENTRIES_ERROR:
      return {
        ...state,
        error: undefined,
      };
    case FETCH_ENTRIES_REQUEST:
      return {
        ...state,
        error: undefined,
        loadingStatus: {
          isLoading: true,
          meterId: action.meterId,
        },
      };
    case DELETE_ENTRY_FAILURE:
    case UPDATE_ENTRY_FAILURE:
    case FETCH_ENTRIES_FAILURE:
      return {
        ...state,
        error: {
          message: action.error,
          meterId: action.meterId,
        },
        loadingStatus: {
          isLoading: false,
          meterId: undefined,
        },
      };
    case DELETE_ENTRY_SUCCESS:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.meterId]: state.entries[action.meterId].filter(
            ({ id }) => id !== action.entry.id
          ),
        },
        loadingStatus: {
          isLoading: false,
          meterId: undefined,
          entryId: undefined,
        },
      };
    case FETCH_ENTRIES_SUCCESS:
      if (state.loadingStatus.isLoading && state.loadingStatus.meterId) {
        const clonedEntries = _.cloneDeep(state.entries);
        clonedEntries[state.loadingStatus.meterId] =
          action.entries[state.loadingStatus.meterId];
        return {
          ...state,
          entries: clonedEntries,
          loadingStatus: {
            isLoading: false,
            meterId: undefined,
          },
        };
      }

      return {
        ...state,
        entries: action.entries.reduce((acc, entry) => {
          if (!_.has(acc, entry.meterId)) {
            acc[entry.meterId] = [];
          }
          acc[entry.meterId].push(entry);
          return acc;
        }, {}),
      };
    case UPDATE_ENTRY_SUCCESS: {
      const e = action.entry;
      if (_.has(state.entries, e.meterId)) {
        const meterEntries = state.entries[e.meterId];
        const idx = _.findIndex(meterEntries, (entry) => entry.id === e.id);
        const clonedMeterEntries = _.cloneDeep(meterEntries);
        if (idx === -1) {
          clonedMeterEntries.push(e);
        } else {
          clonedMeterEntries[idx] = e;
        }
        return {
          ...state,
          entries: {
            ...state.entries,
            [e.meterId]: clonedMeterEntries,
          },
        };
      } else {
        return {
          ...state,
          entries: {
            ...state.entries,
            [e.meterId]: [e],
          },
        };
      }
    }
    case DELETE_METER_SUCCESS: {
      const { meterId } = action;
      if (_.has(state.entries, meterId)) {
        const clonedState = _.cloneDeep(state.entries);
        const filtered = _.omit(clonedState, meterId);
        return {
          ...state,
          entries: filtered,
        };
      }
      return state;
    }
    default:
      return state;
  }
};
