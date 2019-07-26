import React, { useCallback } from "react";
import * as _ from "lodash";
import PropTypes from "prop-types";
import EnumCellRenderer from "./EnumCellRenderer";
import { withMeterContext } from "../../../context";

const MultiEnumCell = ({
  meterId,
  data,
  date,
  imageProvider,
  labelProvider,
  schema,
  color,
  isLoading,
  updateEntry
}) => {
  const isSelected = useCallback(
    val => (data !== undefined ? data.indexOf(val) !== -1 : false),
    [data]
  );
  const updateMulti = useCallback(
    // TODO: if no entries are selected anymore, we should call deleteEntry
    val => {
      if (data === undefined) {
        updateEntry(meterId, date)([val]);
      } else {
        if (data.value.indexOf(val) === -1) {
          updateEntry(meterId, date)(data.value.concat([val]));
        } else {
          updateEntry(meterId, date)(data.value.filter(x => x !== val));
        }
      }
    },
    [updateEntry, meterId, date, data]
  );

  if (_.isEmpty(schema)) {
    return null;
  }

  return (
    <EnumCellRenderer
      color={color}
      date={date}
      data={data && data.value}
      labelProvider={labelProvider}
      imageProvider={imageProvider}
      isSelected={isSelected}
      showImage={false}
      updateEntry={updateMulti}
      schema={schema.items}
      closeOnSelect={false}
      isLoading={isLoading}
    />
  );
};

MultiEnumCell.propTypes = {
  meterId: PropTypes.string.isRequired,
  data: PropTypes.any,
  date: PropTypes.string,
  imageProvider: PropTypes.any,
  labelProvider: PropTypes.any,
  schema: PropTypes.any,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
  updateEntry: PropTypes.func.isRequired
};

export default withMeterContext(React.memo(MultiEnumCell));
