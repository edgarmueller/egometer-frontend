import * as React from "react";
import _ from 'lodash';
import EnumCellRenderer from "./EnumCellRenderer";

class EnumCell extends React.Component {
  update = val => {
    const { meterId, deleteEntry, updateEntry, data, date } = this.props;
    if (data && data.value === val) {
      console.log('delete entry', meterId)
      deleteEntry(meterId, data);
    } else {
      updateEntry(val)
    }
  };

  render() {
    const { data } = this.props;
    const isSelected = val => (data !== undefined ? data === val : false);
    console.log('render enum');
    return (
      <EnumCellRenderer
        {...this.props}
        data={data && data.value}
        singleSelection={true}
        isSelected={isSelected}
        closeOnSelect={true}
        updateEntry={this.update}
      />
    );
  }
}

export default EnumCell;
