import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * Default row renderer for Table.
 */
class DefaultRowRenderer extends Component {
  render() {
    const {
      className,
      columns,
      index,
      rowKey,
      onRowClick,
      onRowDoubleClick,
      onRowMouseOut,
      onRowMouseOver,
      onRowRightClick,
      rowData,
      style,
    } = this.props;
    const a11yProps = {};

    if (
      onRowClick ||
      onRowDoubleClick ||
      onRowMouseOut ||
      onRowMouseOver ||
      onRowRightClick
    ) {
      a11yProps["aria-label"] = "row";
      a11yProps.tabIndex = 0;

      if (onRowClick) {
        a11yProps.onClick = (event) => onRowClick({ event, index, rowData });
      }
      if (onRowDoubleClick) {
        a11yProps.onDoubleClick = (event) =>
          onRowDoubleClick({ event, index, rowData });
      }
      if (onRowRightClick) {
        a11yProps.onContextMenu = (event) =>
          onRowRightClick({ event, index, rowData });
      }
      if (onRowMouseOut) {
        a11yProps.onRowMouseOut = (event) =>
          onRowMouseOut({ event, index, rowData });
      }
      if (onRowMouseOver) {
        a11yProps.onRowMouseOver = (event) =>
          onRowMouseOver({ event, index, rowData });
      }
    }

    return (
      <div
        {...a11yProps}
        className={className}
        key={rowKey}
        role="row"
        style={style}
      >
        {columns}
      </div>
    );
  }
}

DefaultRowRenderer.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array,
  index: PropTypes.number,
  rowKey: PropTypes.string,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onRowMouseOut: PropTypes.func,
  onRowMouseOver: PropTypes.func,
  onRowRightClick: PropTypes.func,
  rowData: PropTypes.object,
  style: PropTypes.object,
};

export default DefaultRowRenderer;
