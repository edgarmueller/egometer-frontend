import * as _ from 'lodash';
import entriesReducer from '../../reducers/entries';
import {counterEntries, counterMeterId, moodEntries, moodMeterId} from "../../__mocks__/fixtures";
import {FETCH_ENTRIES_REQUEST, FETCH_ENTRIES_SUCCESS, DELETE_ENTRY_REQUEST, DELETE_METER_SUCCESS, DELETE_ENTRY_SUCCESS} from "../../actions";

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

  it('should set the loading status of a all meters', () => {
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
});