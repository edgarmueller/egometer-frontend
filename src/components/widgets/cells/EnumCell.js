import * as React from "react";
import EnumCellRenderer from "./EnumCellRenderer";

class EnumCell extends React.Component {
  render() {
    const { data } = this.props;
    const isSelected = val => (data !== undefined ? data === val : false);
    return (
      <EnumCellRenderer
        {...this.props}
        isSelected={isSelected}
        closeOnSelect={true}
      />
    );
  }
}

export default EnumCell;
