import React from "react";
import * as _ from "lodash";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import * as api from "../../api";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
});

export class CreateSchemaDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: undefined,
      schemaName: undefined,
      schemaNameError: undefined,
      schemaError: undefined,
    };
    this.createSchema = this.createSchema.bind(this);
  }

  createSchema() {
    if (this.state.schemaName === undefined) {
      this.setState({
        schemaNameError: "No schema name given",
      });
    }

    if (this.state.schema === undefined) {
      // TODO: also check parseability
      this.setState({
        schemaError: "No schema given",
      });
    }

    if (
      this.state.schemaName !== undefined &&
      this.state.schema !== undefined
    ) {
      try {
        const parsedSchema = JSON.parse(this.state.schema);
        api.submitSchema(this.state.schemaName, parsedSchema).then(
          () => {
            this.setState({
              schemaNameError: undefined,
              schemaError: undefined,
            });
            this.props.fetchSchemas();
            this.props.onClose();
          },
          (error) => {
            this.setState({ schemaError: error.toString() });
          }
        );
      } catch (error) {
        this.setState({
          schemaError: "Non-parseable schema",
        });
      }
    }
  }

  render() {
    const { classes, open, onClose } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-schema-title"
        aria-describedby="alert-schema-description"
      >
        <DialogTitle id="alert-schema-title">
          Create new meter schema
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-schema-description">
            Please enter a name for the new schema
          </DialogContentText>
          <form className={classes.container}>
            <TextField
              id="schema-name"
              label="Name"
              placeholder="Enter a name for the schema"
              onChange={(ev) =>
                this.setState({
                  schemaName: ev.target.value,
                  schemaNameError: undefined,
                })
              }
              autoFocus
              required
              error={!_.isEmpty(this.state.schemaNameError)}
              helperText={this.state.schemaNameError}
              className={classes.textField}
            />
            <TextField
              id="schema-schema"
              label="JSON schema"
              placeholer="Enter a primitive JSON schema"
              onChange={(ev) =>
                this.setState({
                  schema: ev.target.value,
                  schemaError: undefined,
                })
              }
              error={this.state.schemaError !== undefined}
              helperText={
                this.state.schemaError !== undefined
                  ? this.state.schemaError.toString()
                  : ""
              }
              multiline
              required
              className={classes.textField}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.createSchema} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

CreateSchemaDialog.propTypes = {
  fetchSchemas: PropTypes.func.isRequired,
};

export default withStyles(styles)(CreateSchemaDialog);
