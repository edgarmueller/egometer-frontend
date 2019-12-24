import React, { useCallback, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { MeterContext } from "../../context";

// TODO make a context/hook out of this context?
export const ConnectedComponent = ({
  meterId,
  children,
  data,
  isLoading,
  date,
  updateOnChange,
  fromEvent,
  shouldDebounce
}) => {
  const [value, setValue] = useState((data && data.value) || "");
  useEffect(() => data && setValue(data.value), [data, isLoading, date]);
  const { updateEntry, deleteEntry } = useContext(MeterContext);
  const apiCall = useCallback(
    val => {
      if (val) {
        updateEntry(meterId, date)(val, shouldDebounce);
      } else {
        if (data) {
          deleteEntry(meterId, data);
        }
      }
    },
    [meterId, data, date, shouldDebounce, updateEntry, deleteEntry]
  );
  const submitEntry = useCallback(() => {
    apiCall(value);
  }, [value, apiCall]);
  const updateValue = useCallback(
    ev => {
      const newValue = fromEvent(ev);
      setValue(newValue);
      if (updateOnChange) {
        apiCall(newValue);
      }
    },
    [fromEvent, updateOnChange, apiCall]
  );
  const reset = useCallback(() => setValue(data ? data.value : undefined), [setValue, data]);
  return (
    <React.Fragment>
      {children({
        updateValue,
        data: value,
        submitEntry,
        reset
      })}
    </React.Fragment>
  );
};

ConnectedComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  fromEvent: PropTypes.func,
  updateOnChange: PropTypes.bool,
  // TODO: maybe rename prop to initData?
  meterId: PropTypes.string.isRequired,
  data: PropTypes.any,
  date: PropTypes.string.isRequired,
  shouldDebounce: PropTypes.bool
};

ConnectedComponent.defaultProps = {
  fromEvent: x => x.target.value,
  updateOnChange: true,
  data: undefined,
  shouldDebounce: false
};

export default ConnectedComponent;
