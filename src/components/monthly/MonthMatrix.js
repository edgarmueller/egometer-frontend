import * as React from "react";
import { compose } from "recompose";
import { AutoSizer } from "react-virtualized";
import PropTypes from "prop-types";
import moment from "moment";
import * as _ from "lodash";
import { Column, Table } from "react-virtualized";
import withStyles from "@material-ui/core/styles/withStyles";
import ErrorBoundary from "react-error-boundary";
import DefaultTableRowRenderer from "../cells/DefaultTableRowRenderer";
import Cell from "../cells/Cell";
import styles from "./MonthMatrix.css";
import { createColor } from "../../common/color";
import { pad } from "../../common/date";

const additionalStyles = {
  meterColumn: {
    display: "flex",
    alignItems: "center"
  }
};

class MonthMatrix extends React.Component {
  constructor() {
    super();
    const sortBy = "index";

    this.state = {
      disableHeader: false,
      headerHeight: 60,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 48,
      scrollToIndex: undefined,
      sortBy,
      useDynamicRowHeight: false
    };
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._sort = this._sort.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  rowRenderer(props) {
    return <DefaultTableRowRenderer rowKey={props.key} {...props} />;
  }

  cellRenderer = date => ({ cellData, columnIndex, rowIndex, rowData }) => {
    const {
      colorMapping,
      month,
      year,
      widgets,
      isLoading,
      updateEntry
    } = this.props;
    return (
      <div className='item'>
        <ErrorBoundary>
          <Cell
            color={createColor(
              colorMapping,
              year,
              month,
              rowData,
              columnIndex
            )}
            widget={_.find(
              widgets,
              widget =>
                widget.name === rowData.widget &&
                _.has(widget, "cell")
            )}
            rowData={rowData}
            isLoading={isLoading}
            date={date}
            data={cellData}
            updateEntry={updateEntry(rowData.meterId, date)}
          />
        </ErrorBoundary>
      </div>
    );
  }

  rowGetter = ({ index }) => {
    return this._getDatum(index);
  };

  render() {
    const {
      headerHeight,
      overscanRowCount,
      rowHeight,
      scrollToIndex,
      sortBy
    } = this.state;

    const {
      classes,
      meters,
      days
    } = this.props;

    console.log('month rendering..');

    // if specified in this order the json reponse contains HTML
    // TODO updateEntry={updateEntry(date, props.rowData.meterId)}
    // TODO: 60 per meter + header
    const height = meters.length * 60 + 60;
    const rowCount = meters.length;

    const meterColumn = [
      <Column
        key="meterColumn"
        label="Meter"
        dataKey={"meterName"}
        width={300}
        className={classes.meterColumn}
        cellRenderer={({ cellData }) => (
          <div
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
          >
            {cellData}
          </div>
        )}
      />
    ];
    const columns = meterColumn.concat(
      days.map((day, idx) => {
        const date = `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
        const dayName = moment(day, "YYYY-MM-DD").format("dddd");

        return (
          <Column
            key={date}
            label={
              <div>
                <div>{dayName.substr(0, 3)}</div>
                {day.getDate()}
              </div>
            }
            dataKey={date}
            cellRenderer={this.cellRenderer(date)}
            disableSort
            width={120}
          />
        );
      })
    );
    return (
      <AutoSizer disableHeight defaultHeight={768} defaultWidth={1024}>
        {({ width }) => (
          <Table
            ref="Table"
            headerClassName={styles.headerColumn}
            headerHeight={headerHeight}
            height={height}
            noRowsRenderer={this._noRowsRenderer}
            overscanRowCount={overscanRowCount}
            rowHeight={rowHeight}
            rowGetter={this.rowGetter}
            rowCount={rowCount}
            rowRenderer={this.rowRenderer}
            scrollToIndex={scrollToIndex}
            sort={this._sort}
            sortBy={sortBy}
            width={width > 0 ? width : 100} // during tests the width is negative
          >
            {React.Children.toArray(columns)}
          </Table>
        )}
      </AutoSizer>
    );
  }

  _getDatum(index) {
    const { entries, meters, findBySchemaId } = this.props;
    const e = _.values(entries);
    if (e && index < meters.length) {
      const meter = meters[index];
      const meterEntries = _.flatten(e.filter(e => e[0].meterId === meter.id));
      const schema = findBySchemaId(meter.schemaId);
      if (schema === undefined) {
        return [];
      }
      const res = meterEntries.reduce(
        (acc, o) => {
          acc[o.date] = o.value;
          return acc;
        },
        {
          meterName: meter.name,
          meterId: meter.id,
          schema,
          widget: meter.widget
        }
      );

      return res;
    }

    return [];
  }

  _noRowsRenderer() {
    return <div className={styles.noRows}>No rows</div>;
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0;
    this.setState({ rowCount });
  }

  _onScrollToRowChange(event) {
    const { rowCount } = this.state;
    let scrollToIndex = Math.min(
      rowCount - 1,
      parseInt(event.target.value, 10)
    );

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    this.setState({ scrollToIndex });
  }

  _sort({ sortBy, sortDirection }) {
    const sortedList = this._sortList({ sortBy, sortDirection });
    this.setState({ sortBy, sortDirection, sortedList });
  }
}

MonthMatrix.propTypes = {
  isLoading: PropTypes.bool,
  updateEntry: PropTypes.func.isRequired,
  meters: PropTypes.arrayOf(PropTypes.object),
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  widgets: PropTypes.array.isRequired
};

MonthMatrix.defaultProps = {
  isLoading: false,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

export default compose(withStyles(additionalStyles))(MonthMatrix);
