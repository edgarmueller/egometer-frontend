import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { deleteEntryRequest, updateEntryRequest } from "../../actions";
import { isEmptyValue } from "../../common/meterTypes";
import EntryInput, { isTyped } from "./EntryInput";

/** Edits the entry of a meter on a day and saves the changes. */
const EntryEditor = ({ meter, date, entry, autoFocus }) => {
  const dispatch = useDispatch();
  const onChange = useCallback(
    (value) => {
      const shouldDebounce = isTyped(meter);
      if (isEmptyValue(value)) {
        // also cancels changes that are about to be saved
        dispatch(
          deleteEntryRequest(
            meter.id,
            { ...entry, meterId: meter.id, date },
            shouldDebounce
          )
        );
      } else {
        dispatch(
          updateEntryRequest({ meterId: meter.id, date, value }, shouldDebounce)
        );
      }
    },
    [dispatch, meter, date, entry]
  );

  return (
    <EntryInput
      // typed values are kept in the input, start over on another day
      key={`${meter.id}-${date}`}
      meter={meter}
      value={entry && entry.value}
      onChange={onChange}
      autoFocus={autoFocus}
    />
  );
};

EntryEditor.propTypes = {
  meter: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  entry: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.any,
  }),
  autoFocus: PropTypes.bool,
};

export default EntryEditor;
