import * as _ from 'lodash';
import entriesReducer from '../../reducers/entries';
import {counterEntries, counterMeterId, moodEntries, moodMeterId} from "../../__mocks__/fixtures";
import {
  FETCH_ENTRIES_REQUEST,
  FETCH_ENTRIES_SUCCESS,
  DELETE_ENTRY_SUCCESS,
  UPDATE_ENTRY_SUCCESS,
  DELETE_METER_SUCCESS,
  RESET_ENTRIES_ERROR,
  DELETE_ENTRY_REQUEST,
  DELETE_ENTRY_FAILURE
} from "../../actions";

describe('entries reducer', () => {

  it('should set the loading status of a single meter', () => {
    const s = entriesReducer(
      {
        entries: {
          [counterMeterId]: counterEntries,
          [moodMeterId]: moodEntries
        }
      },
      {
        type: FETCH_ENTRIES_REQUEST,
        meterId: moodMeterId
      });

    expect(s.loadingStatus.isLoading).toBe(true);
    expect(s.loadingStatus.meterId).toBe(moodMeterId);
  });

  it('should set the loading status of all meters', () => {
    const s = entriesReducer(
      {
        entries: {
          [counterMeterId]: counterEntries,
          [moodMeterId]: moodEntries
        }
      },
      {
        type: FETCH_ENTRIES_REQUEST
      });

    expect(s.loadingStatus.isLoading).toBe(true);
    expect(s.loadingStatus.meterId).toBe(undefined);
  });

  it('should be capable of updating a single meter', () => {
    const s = entriesReducer(
      {
        entries: {
          [counterMeterId]: counterEntries,
          [moodMeterId]: moodEntries
        }
      },
      {
        type: FETCH_ENTRIES_REQUEST,
        meterId: moodMeterId
      });

    const clonedEntries = _.cloneDeep(moodEntries);
    clonedEntries.push(
      {
        id: '5abfbf3b8fdd856d4c35f77c',
        date: '2018-04-18',
        meterId: moodMeterId,
        value: 'dabomb'
      }
    );

    const after = entriesReducer(
      s,
      {
        type: FETCH_ENTRIES_SUCCESS,
        entries: {
          [moodMeterId]: clonedEntries
        }
      }
    );

    expect(after.entries[counterMeterId].length).toBe(3);
    expect(after.entries[moodMeterId].length).toBe(4);
  });

  it('should delete an entry', () => {
    const after = entriesReducer(
      {
        entries: {
          [counterMeterId]: counterEntries,
          [moodMeterId]: moodEntries
        }
      },
      {
        type: DELETE_ENTRY_SUCCESS,
        meterId: counterMeterId,
        entry: {
          id: counterEntries[0].id
        }
      });
      expect(after.entries[counterMeterId]).toHaveLength(2);
  });

  it("should popule entries", () => {
    const after = entriesReducer(
      {
        entries: { [counterMeterId]: [] },
        loadingStatus: { isLoading: false }
      },
      {
        type: FETCH_ENTRIES_SUCCESS,
        entries: [
          {
            meterId: counterMeterId,
            entries: counterEntries
          }
        ]
      }
    );
    expect(after.entries[counterMeterId]).toHaveLength(3);
  });

  it('should update an entry', () => {
    const after = entriesReducer(
      {
        entries: { [counterMeterId]: counterEntries },
        loadingStatus: { isLoading: false }
      },
      {
        type: UPDATE_ENTRY_SUCCESS,
        entry: {
          meterId: counterMeterId,
          id: counterEntries[0].id,
          date: counterEntries[0].date,
          value: 42
        }
      }
    );
    expect(after.entries[counterMeterId][0].value).toBe(42);
    expect(after.entries[counterMeterId]).toHaveLength(3);
  });

  it('should add entry if it does not exist', () => {
    const after = entriesReducer(
      {
        entries: { [counterMeterId]: counterEntries },
        loadingStatus: { isLoading: false }
      },
      {
        type: UPDATE_ENTRY_SUCCESS,
        entry: {
          meterId: counterMeterId,
          id: 'new id',
          date: counterEntries[0].date,
          value: 42
        }
      }
    );
    expect(after.entries[counterMeterId]).toHaveLength(4);
  });

  it('should add entry if it no entries exist yet', () => {
    const after = entriesReducer(
      {
        entries: { [counterMeterId]: [] },
        loadingStatus: { isLoading: false }
      },
      {
        type: UPDATE_ENTRY_SUCCESS,
        entry: {
          meterId: counterMeterId,
          id: 'new id',
          date: counterEntries[0].date,
          value: 42
        }
      }
    );
    expect(after.entries[counterMeterId][0].id).toBe('new id');
    expect(after.entries[counterMeterId]).toHaveLength(1);
  });


  it('should add entry if meter has not enry yet', () => {
    const after = entriesReducer(
      {
        entries: { },
        loadingStatus: { isLoading: false }
      },
      {
        type: UPDATE_ENTRY_SUCCESS,
        entry: {
          meterId: counterMeterId,
          id: 'new id',
          date: counterEntries[0].date,
          value: 42
        }
      }
    );
    expect(after.entries[counterMeterId][0].id).toBe('new id');
    expect(after.entries[counterMeterId]).toHaveLength(1);
  });

  it('should delete a meter', () => {
    const after = entriesReducer(
      {
        entries: {
          [counterMeterId]: counterEntries,
          [moodMeterId]: moodEntries
        },
        loadingStatus: { isLoading: false }
      },
      {
        type: DELETE_METER_SUCCESS,
        meterId: counterMeterId
      }
    );
    expect(Object.keys(after.entries)).toHaveLength(1);
  });

  it('should return state if no meter to be deleted could not be found', () => {
    const after = entriesReducer(
      {
        entries: {
          [counterMeterId]: counterEntries,
          [moodMeterId]: moodEntries
        },
        loadingStatus: { isLoading: false }
      },
      {
        type: DELETE_METER_SUCCESS,
        meterId: '42'
      }
    );
    expect(Object.keys(after.entries)).toHaveLength(2);
  });

  it('should reset any error', () => {
    const { error } = entriesReducer( { error: 'yo' }, { type: RESET_ENTRIES_ERROR });
    expect(error).toBeUndefined();
  });

  it('should reset any errors when performing a delete', () => {
    const { error } = entriesReducer( { error: 'yo' }, { type: DELETE_ENTRY_REQUEST });
    expect(error).toBeUndefined();
  });

  it('should reset any errors when requesting an entry', () => {
    const { error } = entriesReducer( { error: 'yo' }, { type: FETCH_ENTRIES_REQUEST });
    expect(error).toBeUndefined();
  });

  it('should know about failure cause when delete has failed', () => {
    const { error } = entriesReducer(
      { error: undefined }, 
      { 
        type: DELETE_ENTRY_FAILURE,
        error: 'unknown error',
        meterId: counterMeterId
      }
    );
    expect(error.message).toBe('unknown error');
    expect(error.meterId).toBe(counterMeterId);
  });
});