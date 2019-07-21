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
  const handleOnChange = useCallback(
    ev => {
      const newValue = fromEvent(ev);
      setValue(newValue);
      if (updateOnChange) {
        updateEntry(meterId, date)(newValue, shouldDebounce);
      }
    },
    [fromEvent, updateOnChange, updateEntry, shouldDebounce]
  );
  const submitEntry = useCallback(() => updateEntry(value, shouldDebounce), [
    updateEntry,
    shouldDebounce
  ]);
  const handleOnBlur = useCallback(() => submitEntry(), [submitEntry]);
  const handleOnKeyDown = useCallback(ev => setValue(fromEvent(ev)), [
    fromEvent,
    setValue
  ]);
  const reset = useCallback(() => setValue(data.value), [setValue]);
  return (
    <React.Fragment>
      {children({
        handleOnChange,
        handleOnKeyDown,
        handleOnBlur,
        data: value,
        submitEntry: submitEntry,
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
  date: PropTypes.string,
  shouldDebounce: PropTypes.bool
};

ConnectedComponent.defaultProps = {
  fromEvent: x => x.target.value,
  updateOnChange: true,
  data: undefined,
  shouldDebounce: false
};

export default ConnectedComponent;
