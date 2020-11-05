import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";
import moment from "moment";
import NoCellRenderer from "./NoCellRenderer";

// TODO: rename to CellDispatch
export class Cell extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { data, widget, style } = this.props;
    return (
      !_.isEqual(data, nextProps.data) ||
      !_.isEqual(widget, nextProps.widget) ||
      (this.props.isLoading && !nextProps.isLoading) ||
      !_.isEqual(style, nextProps.style)
    );
  }

  render() {
    const today = moment().format("YYYY-MM-DD");
    const { data, rowData, date, isLoading, color, widget, style } = this.props;

    if (widget === undefined || widget.cell === undefined) {
      return <NoCellRenderer />;
    }

    const WidgetCell = widget.cell;
    const hasData = !_.isEmpty(data) && !!data.value;

    return (
      <WidgetCell
        isLoading={isLoading}
        schema={rowData.schema}
        data={data}
        date={date}
        meterId={rowData.meterId}
        color={
          hasData ? color : today === date ? "rgba(246, 246, 31, 0.56)" : null
        }
        style={style}
      />
    );
  }
}

Cell.propTypes = {
  data: PropTypes.any,
  widget: PropTypes.object,
  style: PropTypes.object,
  rowData: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
};

Cell.defaultProps = {
  data: undefined,
};

export default Cell;
