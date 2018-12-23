import React from "react";
import {
  connect
} from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  compose,
  withProps
} from "recompose";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import Category from './Category';
import widgets from "../../widgets";
import {
  getSchemas,
  findBySchemaName
} from "../../reducers";
import * as api from "../../api";

const filterApplicableWidgets = (widgets, schema) => {
  return _.filter(widgets, widget => widget.isApplicable(schema) > -1);
};
export class AddMeterDialog extends React.Component {
  constructor(props) {
    super(props);
    const applicableWidgets = !_.isEmpty(props.schemas) ?
      filterApplicableWidgets(props.widgets, _.head(props.schemas).schema) :
      [];
    this.state = {
      selectedSchema: props.schemas.length > 0 ? _.head(props.schemas) : undefined,
      selectedVis: _.head(applicableWidgets) !== undefined ?
        _.head(applicableWidgets).name :
        "",
      applicableVis: applicableWidgets,
      name: ""
    };
  }

  handleSubmit = (schemaId, name, widget) => {
    api
      .createMeter(schemaId, name.trim(), widget, "#cecece")
      .then(
        () => this.props.onSubmit(),
        errorMsg => this.setState({
          error: errorMsg
        })
      );
  };

  render() {
    const {
      findBySchemaName,
      open,
      handleClose,
      widgets,
      schemas
    } = this.props;

    const widgetsByCategory = _.groupBy(
      _.map(widgets, widget => {
        const category = _.isEmpty(widget.category) ?
          "Uncategorized" :
          widget.category;
        return {
          ...widget,
          category
        };
      }),
      widget => widget.category
    );

    const availableSchemaIds = schemas.map(schema => schema.name)
    const widgetsPerCategory = _.keys(widgetsByCategory)
      .filter(category => category !== "Custom")
      .concat(["Custom"])
      .reduce((acc, category) => {
        const availableWidgets = widgetsByCategory[category];
        const applicableWidgets = availableWidgets
          .filter(vis => vis.name !== undefined && vis.label !== undefined && availableSchemaIds.indexOf(vis.schemaId) !== -1);
        if (applicableWidgets.length > 0) {
          acc[category] = applicableWidgets;
        }
        return acc;
      }, {});

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-schema-title"
        aria-describedby="alert-schema-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-schema-title">Add Meter</DialogTitle>
        <DialogContent>
          <div style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
          >
            {
              _.keys(widgetsPerCategory).length > 0 ?
                _.map(
                  _.keys(widgetsPerCategory),
                  category =>
                    <Category
                      key={category}
                      widgets={widgetsPerCategory[category]}
                      category={category}
                      schemas={schemas}
                      findBySchemaName={findBySchemaName}
                      handleSubmit={this.handleSubmit}
                      drawTitle
                    />
                ) : <Typography variant="body1">Sorry, no widgets seem applicable</Typography>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddMeterDialog.propTypes = {
  findBySchemaName: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  widgets: PropTypes.array.isRequired
};

AddMeterDialog.defaultProps = {
  open: false
};

const mapStateToProps = state => ({
  schemas: getSchemas(state),
  findBySchemaName(schemaName) {
    return findBySchemaName(schemaName)(state);
  }
});

export default compose(
  withProps({ widgets }),
  connect(
    mapStateToProps,
    null
  )
)(AddMeterDialog);