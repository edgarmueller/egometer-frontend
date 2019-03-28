import * as React from "react";
import { compose } from "recompose";
import PropTypes from "prop-types";
import moment from "moment";
import * as _ from "lodash";
import { Column, Table } from "react-virtualized";
import withStyles from "@material-ui/core/styles/withStyles";
import ErrorBoundary from "react-error-boundary";
import Cell from "../cells/Cell";
import DefaultTableRowRenderer from "../cells/DefaultTableRowRenderer";
import styles from "../monthly/MonthMatrix.css";
import { pad } from "../../common/date";
import { createColor, getProgressColor } from "../../common/color";
import { calcProgress } from "../../common/progress";

const additionalStyles = {
  meterColumn: {
    display: "flex",
    alignItems: "center"
  }
};

class WeeklyMatrix extends React.PureComponent {
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
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.entries, prevProps.entries)) {
      this.calcProgress();
    }
  }

  componentDidMount() {
    this.calcProgress();
  }

  calcProgress = () => {
    const { entries, meters, days } = this.props;
    this.setState({ progress: calcProgress(entries, meters, days) });
  };

  getProgress = (meterId, date) => {
    if (this.state.progress) {
      const foundMeter = this.state.progress[meterId];
      if (foundMeter && date) {
        const foundEntry = foundMeter.entries.find(e => e.date === date);
        if (foundEntry) {
          return { progress: foundEntry.value / foundMeter.meter.dailyGoal };
        }
        return undefined;
      }
      return this.state.progress[meterId];
    }
    return undefined;
  };

  rowRenderer(props) {
    const meterId = props.rowData.meterId;
    let progressEntry = 0;
    if (this.state.progress) {
      progressEntry = this.state.progress[meterId];
    }
    return (
      <DefaultTableRowRenderer
        rowKey={props.key}
        {...props}
        style={{
          backgroundColor: getProgressColor(progressEntry, 0.2),
          padding: 5,
          borderRadius: 3
        }}
      />
    );
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
      widgets,
      isLoading,
      updateEntry,
      days
    } = this.props;

    // if specified in this order the json reponse contains HTML
    // TODO updateEntry={updateEntry(date, props.rowData.meterId)}
    // TODO: 60 per meter + header
    const height = meters.length * 60 + 60;
    const rowCount = meters.length;

    const rowGetter = ({ index }) => this._getDatum(index);

    const meterColumn = [
      <Column
        key="meterColumn"
        label="Meter"
        dataKey={"meterName"}
        width={200}
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
      days.map(d => {
        const day = d.getDate();
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
              const progress = this.getProgress(
                props.rowData.meterId,
                props.dataKey
              );
              return (
                <div className={"item"}>
                  <ErrorBoundary>
                    <Cell
                      style={{
                        border: progress
                          ? `2px solid ${getProgressColor(progress, 0.9)}`
                          : null,
                        padding: 3
                      }}
                      color={createColor(
                        colorMapping,
                        year,
                        month,
                        props.rowData,
                        props.columnIndex
                      )}
                      widget={_.find(
                        widgets,
                        widget =>
                          widget.name === props.rowData.widget &&
                          _.has(widget, "cell")
                      )}
                      rowData={props.rowData}
                      isLoading={isLoading}
                      date={date}
                      data={cellData}
                      updateEntry={updateEntry(props.rowData.meterId, date)}
                    />
                  </ErrorBoundary>
                </div>
              );
            }}
            disableSort
            width={90}
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
          headerHeight={headerHeight}
          height={height}
          noRowsRenderer={this._noRowsRenderer}
          overscanRowCount={overscanRowCount}
          rowHeight={rowHeight}
          rowGetter={rowGetter}
          rowCount={rowCount}
          rowRenderer={this.rowRenderer}
          scrollToIndex={scrollToIndex}
          sort={this._sort}
          sortBy={sortBy}
          width={768}
          style={{ margin: "0 auto", width: 768 }}
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
}

WeeklyMatrix.propTypes = {
  isLoading: PropTypes.bool,
  updateEntry: PropTypes.func.isRequired,
  meters: PropTypes.arrayOf(PropTypes.object),
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  widgets: PropTypes.array.isRequired
};

WeeklyMatrix.defaultProps = {
  isLoading: false,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

export default compose(withStyles(additionalStyles))(WeeklyMatrix);
