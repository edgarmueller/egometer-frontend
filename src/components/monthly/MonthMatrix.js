import * as React from "react";
import { compose } from "recompose";
import PropTypes from "prop-types";
import moment from "moment";
import * as _ from "lodash";
import { Column, Table } from "react-virtualized";
import hexToRgba from "hex-to-rgba";
import withStyles from "@material-ui/core/styles/withStyles";
import ErrorBoundary from "react-error-boundary";
import DefaultTableRowRenderer from "./DefaultTableRowRenderer";
import Cell from "./Cell";
import styles from "./MonthMatrix.css";

const pad = s => {
  while (s.length < 2) {
    s = "0" + s;
  }
  return s;
};

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

const createColor = (colorMapping, year, month, rowData, columnIndex) => {
  const streak = calcStreak(rowData, year, month, columnIndex);
  const alpha = 0.4 + streak / 10;
  if (colorMapping && colorMapping[rowData.meterName]) {
    return hexToRgba(colorMapping[rowData.meterName], alpha);
  }
  return "#fff";
};

const calcStreak = (year, m, rowData, startIndex) => {
  let i = startIndex;
  let streak = 0;
  while (i >= 0) {
    const month = pad(m.toString());
    const day = pad(i.toString());
    const key = `${year}-${month}-${day}`;

    if (_.has(rowData, key)) {
      streak += 1;
      i -= 1;
    } else {
      return streak;
    }
  }

  return streak;
};

const additionalStyles = {
  meterColumn: {
    display: "flex",
    alignItems: "center"
  }
};

class MonthMatrix extends React.PureComponent {
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
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  rowRenderer(props) {
    return <DefaultTableRowRenderer rowKey={props.key} {...props} />;
  }

  render() {
    const {
      disableHeader,
      headerHeight,
      overscanRowCount,
      rowHeight,
      scrollToIndex,
      sortBy
    } = this.state;

    const {
      classes,
      colorMapping,
      meters,
      month,
      year,
      width,
      widgets,
      isLoading,
      updateEntry
    } = this.props;

    // if specified in this order the json reponse contains HTML
    // TODO updateEntry={updateEntry(date, props.rowData.meterId)}
    // TODO: 60 per meter + header
    const height = meters.length * 60 + 60;
    const rowCount = meters.length;
    const days = daysInMonth(year, month);

    const rowGetter = ({ index }) => {
      return this._getDatum(index);
    };

    const meterColumn = [
      <Column
        key="meterColumn"
        label="Meter"
        dataKey={"meterName"}
        width={300}
        className={classes.meterColumn}
        cellRenderer={({ cellData, ...props }) => (
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
      _.range(1, days + 1).map(day => {
        const date = `${year}-${pad(month.toString())}-${pad(day.toString())}`;
        const dayName = moment(date, "YYYY-MM-DD").format("dddd");

        return (
          <Column
            key={day}
            label={
              <div>
                <div>{dayName.substr(0, 3)}</div>
                {day}
              </div>
            }
            dataKey={date}
            cellRenderer={({ cellData, ...props }) => {
              const isHovered =
                props.columnIndex === this.state.hoveredColumnIndex ||
                props.rowIndex === this.state.hoveredRowIndex;
              const className = isHovered ? "item hoveredItem" : "item";

              return (
                <div
                  className={className}
                  onMouseOver={() => {
                    this.setState({
                      hoveredColumnIndex: props.columnIndex,
                      hoveredRowIndex: props.rowIndex
                    });
                  }}
                  onMouseOut={() => {
                    this.setState({
                      hoveredColumnIndex: -1,
                      hoveredRowIndex: -1
                    });
                  }}
                >
                  <ErrorBoundary>
                    <Cell
                      color={createColor(
                        colorMapping,
                        year,
                        month,
                        props.rowData,
                        props.columnIndex
                      )}
                      rowData={props.rowData}
                      isLoading={isLoading}
                      date={date}
                      data={cellData}
                      updateEntry={updateEntry(props.rowData.meterId, date)}
                      widgets={widgets}
                      widgetId={props.rowData.widget}
                    />
                  </ErrorBoundary>
                </div>
              );
            }}
            disableSort
            width={120}
          />
        );
      })
    );
    return (
      <React.Fragment>
        <Table
          ref="Table"
          disableHeader={disableHeader}
          headerClassName={styles.headerColumn}
          onHeaderClick={ev => console.log(ev)}
          headerHeight={headerHeight}
          height={height}
          noRowsRenderer={this._noRowsRenderer}
          overscanRowCount={overscanRowCount}
          rowClassName={this._rowClassName}
          rowHeight={rowHeight}
          rowGetter={rowGetter}
          rowCount={rowCount}
          rowRenderer={this.rowRenderer}
          scrollToIndex={scrollToIndex}
          sort={this._sort}
          sortBy={sortBy}
          width={width > 0 ? width : 100} // tests cause the width to become negative
        >
          {React.Children.toArray(columns)}
        </Table>
      </React.Fragment>
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

  _headerRenderer({ dataKey }) {
    return (
      <div onClick={() => console.log("header was clicked!")}>{dataKey}</div>
    );
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

  _rowClassName({ index }) {
    if (index < 0) {
      return styles.headerRow;
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow;
    }
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
  width: PropTypes.number.isRequired,
  widgets: PropTypes.array.isRequired
};

MonthMatrix.defaultProps = {
  isLoading: false,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

export default compose(withStyles(additionalStyles))(MonthMatrix);
