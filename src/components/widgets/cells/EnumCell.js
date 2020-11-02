import React, { useCallback } from "react";
import PropTypes from "prop-types";
import EnumCellRenderer from "./EnumCellRenderer";
import { withMeterContext } from "../../../context";

const EnumCell = ({
  meterId,
  data,
  date,
  imageProvider,
  labelProvider,
  schema,
  color,
  isLoading,
  updateEntry,
  deleteEntry,
}) => {
  const update = useCallback(
    (val) => {
      if (data && data.value === val) {
        deleteEntry(meterId, data);
      } else {
        updateEntry(meterId, date)(val);
      }
    },
    [updateEntry, deleteEntry, meterId, data, date]
  );
  const isSelected = useCallback(
    (val) => (data !== undefined ? data === val : false),
    [data]
  );
  return (
    <EnumCellRenderer
      color={color}
      date={date}
      data={data && data.value}
      labelProvider={labelProvider}
      imageProvider={imageProvider}
      singleSelection={true}
      isSelected={isSelected}
      closeOnSelect={true}
      schema={schema}
      updateEntry={update}
      isLoading={isLoading}
    />
  );
};

EnumCell.propTypes = {
  meterId: PropTypes.string.isRequired,
  data: PropTypes.any,
  date: PropTypes.string,
  imageProvider: PropTypes.func.isRequired,
  labelProvider: PropTypes.func.isRequired,
  schema: PropTypes.any,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default withMeterContext(React.memo(EnumCell));
