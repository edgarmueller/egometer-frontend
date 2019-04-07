import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as _ from "lodash";
import { compose, withProps } from "recompose";
import Ionicon from "react-ionicons";
import * as actions from "../../actions";
import { getMeters, getSchemas } from "../../reducers";
import { findBySchemaId } from "../../utils"
import widgets from "../../widgets";
import { createProgressSuccessColor } from "../../common/color";
import NoWidgetFound from "./NoWidgetFound";

export class Widget extends React.Component {
  constructor(props) {
    super(props);
    const { date, widgets, meter, progress, widgetType } = props;
    const widget = widgets.find(widget => widget.name === meter.widget);
    const dailyGoalHit =
      progress && progress.entries.find(e => e.date === date) !== undefined;
    this.state = {
      widget: _.has(widget, widgetType) ? widget[widgetType] : undefined,
      dailyGoalHit
    };
  }

  updateEntry = (value, shouldDebounce) => {
    const { updateEntry, meter, date } = this.props;
    return updateEntry(meter.id, date)(value, shouldDebounce);
  };

  shouldComponentUpdate(nextProps) {
    const {
      data,
      date,
      meter,
      width,
      height,
      isLoading,
      progress
    } = this.props;
    return (
      !_.isEqual(nextProps.data, data) ||
      !_.isEqual(nextProps.meter, meter) ||
      !_.isEqual(nextProps.progress, progress) ||
      nextProps.date !== date ||
      nextProps.width !== width ||
      nextProps.height !== height ||
      nextProps.isLoading !== isLoading
    );
  }

  updateWidget = () => {
    const { meter, widgetType, widgets } = this.props;
    const widget = widgets.find(widget => widget.name === meter.widget);
    if (widget) {
      this.setState({ widget: widget[widgetType] });
    } else {
      this.setState({ widget: undefined });
    }
  };

  updateGoal = () => {
    const { date, progress } = this.props;
    if (progress) {
      this.setState({
        dailyGoalHit: progress.entries.find(e => e.date === date) !== undefined
      });
    }
  };

  componentDidMount() {
    this.updateWidget();
    this.updateGoal();
  }

  componentDidUpdate(prevProps) {
    const { date, meter, progress } = this.props;
    if (!_.isEqual(meter, prevProps.meter)) {
      this.updateWidget();
    }

    if (!_.isEqual(progress, prevProps.progress) || date !== prevProps.date) {
      this.updateGoal();
    }
  }

  render() {
    const { date, data, meter, schema, isLoading, widgetType } = this.props;

    const { dailyGoalHit, widget } = this.state;

    if (schema === undefined) {
      return null;
    }
    if (widget === null || widget === undefined) {
      return (
        <NoWidgetFound widgetType={widgetType} requestedWidget={meter.widget} />
      );
    }

    const WidgetComponent = widget;

    return (
      <div
        style={{
          backgroundColor: dailyGoalHit ? createProgressSuccessColor(1) : null
        }}
      >
        <WidgetComponent
          icon={
            widget.icon || (meter.icon ? <Ionicon icon={meter.icon} /> : null)
          }
          isLoading={isLoading}
          meter={meter}
          date={date}
          data={data}
          schema={schema}
          updateEntry={this.updateEntry}
        />
      </div>
    );
  }
}

Widget.propTypes = {
  // TODO: what type should date be?
  date: PropTypes.string.isRequired, // actually this is a moment object type
  schema: PropTypes.object,
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
  const foundSchema = findBySchemaId(getSchemas(state), ownProps.meter.schemaId);
  return {
    meters: getMeters(state),
    schema: foundSchema,
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
