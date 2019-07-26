import { updateEntryRequest, deleteEntryRequest } from "../actions";

export const mapDispatchToCrudMethodProps = dispatch => ({
  updateEntry: (meterId, date) => (value, shouldDebounce) => {
    return dispatch(
      updateEntryRequest(
        {
          meterId,
          date,
          value
        },
        shouldDebounce
      )
    );
  },
  deleteEntry: (meterId, entry) => dispatch(deleteEntryRequest(meterId, entry))
});
