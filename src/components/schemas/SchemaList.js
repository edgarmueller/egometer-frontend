import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import InspectIcon from "@material-ui/icons/FindInPage";
import { ShowMessageDialog } from "../common/ShowMessageDialog";
import CreateSchemaDialog from "./CreateSchemaDialog";
import { display1 } from "../../common/styles";
import { getSchemas, isSchemasLoading } from "../../reducers";

import * as actions from "../../actions";
import * as api from "../../api";

const styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  display1,
  root: {
    width: 720,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "0 auto",
  },
  button: {
    margin: "0.25em",
    float: "right",
  },
  table: {
    width: 700,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export class Schemas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      editSchema: undefined,
      open: false,
      openShow: false,
    };
  }

  componentDidMount() {
    this.props.fetchSchemas();
  }

  deleteSchema = (schema) => {
    this.props.deleteSchema(schema);
  };

  handleClickShow = (schema) => {
    this.setState({
      selectedSchema: schema,
      openShow: true,
    });
  };

  handleCloseShow = () => {
    this.setState({
      openShow: false,
    });
  };

  handleCreate = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;

    if (this.props.isSchemasLoading) {
      return <div>Loading schemas</div>;
    }

    return (
      <div>
        <Typography variant="display1" className={classes.display1}>
          Manage Schemas
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Schema name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.schemas ? (
                this.props.schemas.map((schema) => (
                  <TableRow key={schema.id}>
                    <TableCell>
                      <strong>{schema.name}</strong>
                      &nbsp;(
                      {schema.id})
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="Show schema definition"
                        onClick={() => this.handleClickShow(schema)}
                      >
                        <InspectIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete schema"
                        onClick={() => this.deleteSchema(schema)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>No schemas defined yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button
            color="primary"
            variant="fab"
            className={classes.button}
            onClick={this.handleCreate}
          >
            <AddIcon />
          </Button>

          <CreateSchemaDialog
            open={this.state.open}
            onClose={this.handleClose}
            fetchSchemas={this.props.fetchSchemas}
          />

          <ShowMessageDialog
            open={this.state.openShow}
            onClose={this.handleCloseShow}
            title={
              this.state.selectedSchema &&
              `Schema of ${this.state.selectedSchema.name}`
            }
            text={
              this.state.selectedSchema &&
              JSON.stringify(this.state.selectedSchema.schema, null, 2)
            }
          />
        </Paper>
      </div>
    );
  }
}

Schemas.propTypes = {
  deleteSchema: PropTypes.func,
  fetchSchemas: PropTypes.func,
  classes: PropTypes.object,
  schemas: PropTypes.array,
  isSchemasLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  schemas: getSchemas(state),
  isSchemasLoading: isSchemasLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchSchemas() {
    dispatch(actions.fetchSchemas());
  },
  deleteSchema(schema) {
    api.deleteSchema(schema).then(
      () => dispatch(actions.fetchSchemas()),
      // eslint-disable-next-line no-undef
      (error) => console.log("error occurred while deleting schema", error)
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Schemas));
