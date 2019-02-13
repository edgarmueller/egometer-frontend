import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";
import moment from "moment";
import ReportIcon from "@material-ui/icons/Report";

const NoCellRendererFound = () => (
  <div style={{ color: "red" }}>
    <ReportIcon />
  </div>
);

export class Cell extends React.Component {
  shouldComponentUpdate(nextProps, nextState, snapshot) {
    return (
      !_.isEqual(this.props.data, nextProps.data) ||
      (this.props.isLoading && !nextProps.isLoading) ||
      this.props.isHovered !== nextProps.isHovered
    );
  }

  render() {
    const today = moment().format("YYYY-MM-DD");

    const {
      data,
      rowData,
      date,
      updateEntry,
      widgets,
      widgetId,
      isLoading,
      color
    } = this.props;

    //console.log("props", this.props);
    const foundWidget = _.find(widgets, widget => widget.name === widgetId);
    if (_.has(foundWidget, "cell") && foundWidget.cell !== undefined) {
      const Cell = foundWidget["cell"];
      return (
        <Cell
          isLoading={isLoading}
          schema={rowData.schema}
          data={data}
          date={date}
          updateEntry={updateEntry}
          meterId={rowData.meterId}
          color={
            data ? color : today === date ? "rgba(246, 246, 31, 0.56)" : null
          }
        />
      );
    }

    return <NoCellRendererFound />;
  }
}

Cell.propTypes = {
  data: PropTypes.any,
  rowData: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  updateEntry: PropTypes.func.isRequired,
  widgets: PropTypes.array.isRequired,
  widgetId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired
};

Cell.defaultProps = {
  data: undefined
};

export default Cell;
