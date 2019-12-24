import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
import { Column, Table } from "react-virtualized";
import ErrorBoundary from "react-error-boundary";
import { withStyles } from "@material-ui/core";
import { Emoji } from "emoji-mart";
import Cell from "../cells/Cell";
import styles from "../monthly/MonthMatrix.css";
import { pad } from "../../common/date";
import { createColor, getProgressColor } from "../../common/color";
import DefaultTableRowRenderer from "../cells/DefaultTableRowRenderer";
import { findBySchemaId } from "../../utils";

const HEADER_HEIGHT = 60;
const OVERSCAN_ROW_COUNT = 10;
const ROW_HEIGHT = 40;

const additonalStyles = {
  meterColumn: {
    display: "flex",
    alignItems: "center"
  },
  title: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontWeight: "bold",
    fontSize: "0.85rem",
    paddingLeft: "0.15rem"
  }
};

class MeterTable extends React.Component {
  state = {};

  _noRowsRenderer = () => {
    return <div className={styles.noRows}>No rows</div>;
  };

  _getDatum(index) {
    const { entriesByMeter, meters, schemas } = this.props;
    const e = _.values(entriesByMeter);
    if (e && index < meters.length) {
      const meter = meters[index];
      const meterEntries = (entriesByMeter && entriesByMeter[meter.id]) || [];
      const schema = findBySchemaId(schemas, meter.schemaId);
      if (schema === undefined) {
        return {};
      }
      return meterEntries.reduce(
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
    }

    return [];
  }

  _rowGetter = ({ index }) => this._getDatum(index);

  _getDailyProgress = (meterId, date) => {
    const { entriesByMeter, meters } = this.props;
    if (entriesByMeter) {
      const meter = meters.find(m => m.id === meterId);
      const foundEntries = entriesByMeter[meterId];
      if (foundEntries && date && meter.dailyGoal) {
        const foundEntry = foundEntries.find(e => e.date === date);
        if (foundEntry) {
          return foundEntry.value / meter.dailyGoal;
        }
      }
    }
    return undefined;
  };

  _createColumns = () => {
    const { classes, colorMapping, days, isLoading } = this.props;
    const { widgets } = this.props;
    const meterColumn = [
      <Column
        key="meterColumn"
        label="Meter"
        dataKey={"meter"}
        width={300}
        className={classes.meterColumn}
        cellRenderer={({ cellData: meter }) => {
          if (meter === undefined) {
            return null;
          }
          return (
            <div style={{ display: "flex" }}>
              {meter.icon && (
                <Emoji emoji={meter.icon} size={24} set="emojione" />
              )}
              <div className={classes.title}>{meter.name}</div>
            </div>
          );
        }}
      />
    ];
    return meterColumn.concat(
      days.map(d => {
        const day = d.getDate();
        const date = `${d.getFullYear()}-${pad(
          (d.getMonth() + 1).toString()
        )}-${pad(day.toString())}`;
        const dayName = moment(date, "YYYY-MM-DD").format("dddd");

        return (
          <Column
            key={day}
            label={
              <div style={{ fontSize: "0.65rem" }}>
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
              const progressColor = getProgressColor(dailyProgress, 0.9);
              const color = createColor(colorMapping, props.rowData);
              const widget = _.find(
                widgets,
                w => w.name === props.rowData.widget && _.has(w, "cell")
              );

              return (
                <div className={"item"}>
                  <ErrorBoundary>
                    <Cell
                      style={{
                        border:
                          dailyProgress > 0
                            ? `2px solid ${progressColor}`
                            : null
                      }}
                      color={color}
                      widget={widget}
                      rowData={props.rowData}
                      isLoading={isLoading}
                      date={date}
                      data={cellData}
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
    const { progressByMeter } = this.props;
    const meterId = props.rowData.meterId;
    const progress = progressByMeter && progressByMeter[meterId];
    return (
      <DefaultTableRowRenderer
        rowKey={props.key}
        {...props}
        style={{
          ...props.style,
          backgroundColor: progress ? getProgressColor(progress, 0.2) : null,
          padding: 5,
          borderRadius: 3
        }}
      />
    );
  };

  render() {
    const { meters, width } = this.props;
    // if specified in this order the json reponse contains HTML
    // TODO: 60 per meter + header
    const height = meters.length * 40 + 60;
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
  entriesByMeter: PropTypes.object,
  progressByMeter: PropTypes.object,
  meters: PropTypes.arrayOf(PropTypes.object),
  days: PropTypes.array,
  colorMapping: PropTypes.object,
  isLoading: PropTypes.bool,
  widgets: PropTypes.array,
  width: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default withStyles(additonalStyles)(MeterTable);
