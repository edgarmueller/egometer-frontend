import * as React from "react";
import * as _ from "lodash";
import EnumCellRenderer from "./EnumCellRenderer";

class MultiEnumCell extends React.Component {
  isSelected = val => {
    const { data } = this.props;
    return data !== undefined ? data.indexOf(val) !== -1 : false;
  };

  updateMulti = val => {
    const { data, updateEntry } = this.props;
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

  render() {
    const { updateEntry, schema, ...otherProps } = this.props;

    if (_.isEmpty(schema)) {
      return null;
    }

    return (
      <EnumCellRenderer
        {...otherProps}
        showImage={false}
        updateEntry={this.updateMulti}
        schema={schema.items}
        isSelected={this.isSelected}
        closeOnSelect={false}
      />
    );
  }
}

export default MultiEnumCell;
