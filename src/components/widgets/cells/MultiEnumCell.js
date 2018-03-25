import * as React from "react";
import * as _ from "lodash";
import EnumCellRenderer from "./EnumCellRenderer";

class MultiEnumCell extends React.Component {
  render() {
    const { data, schema, updateEntry } = this.props;

    const isSelected = val =>
      data !== undefined ? data.indexOf(val) !== -1 : false;
    const updateMulti = val => {
      if (data === undefined) {
        updateEntry([val]);
      } else {
        if (data.indexOf(val) === -1) {
          updateEntry(data.concat([val]));
        } else {
          updateEntry(data.filter(x => x !== val));
        }
      }
    };

    if (_.isEmpty(schema)) {
      return null;
    }

    return (
      <EnumCellRenderer
        {...this.props}
        showImage={false}
        updateEntry={updateMulti}
        schema={schema.items}
        isSelected={isSelected}
        closeOnSelect={false}
      />
    );
  }
}

export default MultiEnumCell;
