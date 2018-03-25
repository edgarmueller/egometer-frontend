import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as _ from "lodash";
import { compose, withProps } from "recompose";
import * as actions from "../../actions";
import { findBySchemaId, getMeters } from "../../reducers";
import widgets from "../../widgets";
import Ionicon from "react-ionicons";

const NoWidgetFound = ({ requestedWidget, widgetType }) => {
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        style={{
          backgroundColor: "#f73378",
          color: "#fff",
          borderRadius: 10,
          width: "300px",
          margin: "0 auto 10px",
          padding: 10
        }}
      >
        <Ionicon
          icon="md-close-circle"
          style={{ padding: 10 }}
          color="#fff"
          fontSize={"50"}
        />
        <div style={{ fontWeight: "bold", fontSize: 20 }}>No widget found</div>
        <div>Requested widget: {requestedWidget}</div>
        <div>Widget type: {widgetType}</div>
      </div>
    );
  } else {
    return null;
  }
};

export class Widget extends React.Component {
  render() {
    // TODO: We're no making of loadingStatus here yet, do we?
    const {
      date,
      data,
      meter,
      width,
      height,
      updateEntry,
      isLoading,
      schema,
      findBySchemaId,
      widgetType,
      widgets
    } = this.props;

    let _schema = schema;
    const widget = widgets.find(widget => widget.name === meter.widget);
    if (widget === undefined) {
      console.error("No widget found for name", meter.widget);
      return null;
    }
    const foundWidget = widget[widgetType];
    if (schema === undefined) {
      const foundSchema = findBySchemaId(meter.schemaId);
      if (_.isEmpty(foundSchema)) {
        return null;
      }
      _schema = foundSchema.schema;
    }
    if (foundWidget === null || foundWidget === undefined) {
      return (
        <NoWidgetFound widgetType={widgetType} requestedWidget={meter.widget} />
      );
    }

    const WidgetComponent = foundWidget;
    let w = undefined;
    let h = undefined;
    if (width !== undefined && height !== undefined) {
      w = _.toNumber(width.substr(0, width.length - 2));
      h = _.toNumber(height.substr(0, height.length - 2));
    }

    const meterId = meter.id;

    return (
      <WidgetComponent
        icon={widget.icon}
        isLoading={isLoading}
        meter={meter}
        date={date}
        data={data}
        schema={_schema}
        width={w}
        height={h}
        updateEntry={updateEntry(meterId, date)}
      />
    );
  }
}

Widget.propTypes = {
  // TODO: what type should date be?
  date: PropTypes.string.isRequired, // actually this is a moment object type
  schema: PropTypes.object,
  // TODO: why string?
  width: PropTypes.string,
  height: PropTypes.string,
  // TODO enum
  widgetType: PropTypes.string.isRequired,
  // TODO: what type?
  updateEntry: PropTypes.func.isRequired,
  loadingStatus: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    meterId: PropTypes.string
  })
};

Widget.defaultProps = {
  schema: undefined
};

const mapStateToProps = (state, ownProps) => {
  return {
    loadingStatus: state.entries.loadingStatus,
    meters: getMeters(state),
    findBySchemaId(schemaId) {
      return findBySchemaId(schemaId)(state);
    },
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => ({
  fetchMeters() {
    return dispatch(actions.fetchMeters());
  },
  updateEntry: (meterId, date) => (value, shouldDebounce) => {
    return dispatch(
      actions.updateEntryRequest(
        {
          meterId,
          date,
          value
        },
        shouldDebounce
      )
    );
  }
});

export default compose(
  withProps({ widgets }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Widget);
