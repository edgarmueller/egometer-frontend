import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
import { Column, Table } from "react-virtualized";
import ErrorBoundary from "react-error-boundary";
import { withStyles } from "@material-ui/core";
import { Emoji } from 'emoji-mart'
import Cell from "../cells/Cell";
import styles from "../monthly/MonthMatrix.css";
import { pad } from "../../common/date";
import { createColor, getProgressColor } from "../../common/color";
import DefaultTableRowRenderer from "../cells/DefaultTableRowRenderer";
import { calcProgress } from "../../common/progress";

const HEADER_HEIGHT = 60;
const OVERSCAN_ROW_COUNT = 10;
const ROW_HEIGHT = 48;

const additonalStyles = {
  meterColumn: {
    display: "flex",
    alignItems: "center"
  },
  title: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontWeight: 'bold',
    paddingLeft: '0.15rem'
  }
};

class MeterTable extends React.Component {
  state = {};

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
    const progress = calcProgress(entries, meters, days);
    this.setState({ progress });
  };

  _noRowsRenderer = () => {
    return <div className={styles.noRows}>No rows</div>;
  };

  _getDatum(index) {
    const { entries, meters, findBySchemaId } = this.props;
    const e = _.values(entries);
    if (e && index < meters.length) {
      const meter = meters[index];

      const meterEntries = e.length == 0 ? [] : _.flatten(e.filter(e => e[0].meterId === meter.id));
      const schema = findBySchemaId(meter.schemaId);
      if (schema === undefined) {
        return {};
      }
      const res = meterEntries.reduce(
        (acc, o) => {
          acc[o.date] = o;
          return acc;
        },
        {
          meter,
          meterId: meter.id,
          schema,
          widget: meter.widget
        }
      );

      return res;
    }

    return [];
  }

  _rowGetter = ({ index }) => this._getDatum(index);

  _getDailyProgress = (meterId, date) => {
    if (this.props.entries) {
      const meter = this.props.meters.find(m => m.id === meterId);
      const foundEntries = this.props.entries[meterId];
      if (foundEntries && date) {
        const foundEntry = foundEntries.find(e => e.date === date);
        if (foundEntry) {
          return foundEntry.value / meter.dailyGoal;
        }
      }
    }
    return undefined;
  };

  _createColumns = () => {
    const {
      classes,
      colorMapping,
      days,
      isLoading,
      widgets,
      updateEntry,
      deleteEntry
    } = this.props;
    const meterColumn = [
      <Column
        key="meterColumn"
        label="Meter"
        dataKey={"meter"}
        width={200}
        className={classes.meterColumn}
        cellRenderer={({ cellData: meter }) => {
          if (meter === undefined) {
            return null;
          }
          return (
            <div style={{ display: 'flex' }}>
              {meter.icon && <Emoji emoji={meter.icon} size={24} set='emojione' />}
              <div className={classes.title}>
                {meter.name}
              </div>
            </div >
          )
        }}
      />
    ];
    return meterColumn.concat(
      days.map(d => {
        const day = d.getDate();
        const date = `${d.getFullYear()}-${pad((d.getMonth() + 1).toString())}-${pad(day.toString())}`;
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
              const dailyProgress = this._getDailyProgress(
                props.rowData.meterId,
                props.dataKey
              );
              const progressColor = getProgressColor(dailyProgress, 0.9)
              const color = createColor(
                colorMapping,
                props.rowData,
              );
              return (
                <div className={"item"}>
                  <ErrorBoundary>
                    <Cell
                      style={{
                        border: dailyProgress ? `2px solid ${progressColor}` : null
                      }}
                      color={color}
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
                      deleteEntry={deleteEntry}
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
  };

  _rowRenderer = props => {
    const weeklyProgressPerMeter = calcProgress(this.props.entries, this.props.meters, this.props.days);
    const weeklyProgress = weeklyProgressPerMeter[props.rowData.meterId]
    return (
      <DefaultTableRowRenderer
        rowKey={props.key}
        {...props}
        style={{
          backgroundColor: getProgressColor(weeklyProgress, 0.2),
          padding: 5,
          borderRadius: 3
        }}
      />
    );
  };

  render() {
    const { meters, width } = this.props;
    // if specified in this order the json reponse contains HTML
    // TODO updateEntry={updateEntry(date, props.rowData.meterId)}
    // TODO: 60 per meter + header
    const height = meters.length * 60 + 60;
    const rowCount = meters.length;
    const columns = this._createColumns();

    return (
      <Table
        ref="Table"
        headerClassName={styles.headerColumn}
        headerHeight={HEADER_HEIGHT}
        height={height}
        noRowsRenderer={this._noRowsRenderer}
        overscanRowCount={OVERSCAN_ROW_COUNT}
        rowHeight={ROW_HEIGHT}
        rowGetter={this._rowGetter}
        rowCount={rowCount}
        rowRenderer={this._rowRenderer}
        sort={this._sort}
        sortBy="index"
        width={width}
      >
        {React.Children.toArray(columns)}
      </Table>
    );
  }
}

MeterTable.propTypes = {
  entries: PropTypes.object,
  meters: PropTypes.arrayOf(PropTypes.object),
  findBySchemaId: PropTypes.func.isRequired,
  days: PropTypes.array,
  colorMapping: PropTypes.object,
  updateEntry: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  widgets: PropTypes.array,
  width: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default withStyles(additonalStyles)(MeterTable);
