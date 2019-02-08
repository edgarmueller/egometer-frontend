import * as React from "react";
import * as PropTypes from "prop-types";
import * as _ from "lodash";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Button from "@material-ui/core/Button/Button";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Grid from "@material-ui/core/Grid";
import IconButtonWithLabel from "../../common/IconButtonWithLabel";

const styles = {
  enumIcon: {
    fontSize: "2em",
    margin: "0.5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  dialogTitle: {
    padding: "10px",
    margin: "0 auto",
    fontWeight: "bold"
  },
  enum: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5em",
    fontWeight: 700
  }
};

class EnumCellRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selected: props.data
    };
    this.handleOnOpenClick = this.handleOnOpenClick.bind(this);
  }

  handleOnOpenClick() {
    if (this.state.open) {
      return;
    }
    this.setState({ open: true });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (this.props.date && prevProps.date !== this.props.date) ||
      (prevProps.isLoading && !this.props.isLoading)
    ) {
      this.setState({
        selected: this.props.data
      });
    }
  }

  render() {
    const {
      classes,
      updateEntry,
      imageProvider,
      labelProvider,
      schema,
      isSelected,
      color,
      closeOnSelect,
      showImage,
      date,
      data
    } = this.props;

    if (_.isEmpty(schema)) {
      return null;
    }

    const labelToLiteralMapping = schema.enum.map(literal => [
      labelProvider(literal),
      literal
    ]);

    const label = labelProvider(data);
    return (
      <React.Fragment>
        <div
          className={classes.enum}
          style={{ backgroundColor: color }}
          onClick={this.handleOnOpenClick}
        >
          {// use black as color (== unselected)
          showImage
            ? imageProvider
              ? imageProvider(color, false, data)
              : label
            : null}
        </div>
        <Dialog
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        >
          <DialogTitle disableTypography className={classes.dialogTitle}>
            Update data for {date}
          </DialogTitle>
          <DialogContent>
            <Grid container justify={"center"}>
              <Grid container wrap={"wrap"} justify="space-around">
                {labelToLiteralMapping.map(([label, value]) => (
                  <Grid
                    key={value}
                    item
                    className={classes.enumIcon}
                    onClick={() => {
                      updateEntry(value);
                      this.setState({
                        open: closeOnSelect ? false : true,
                        selected: value
                      });
                    }}
                  >
                    <IconButtonWithLabel
                      label={label}
                      icon={
                        imageProvider
                          ? imageProvider(color, isSelected(value), value)
                          : null
                      }
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid
                item
                style={{
                  paddingTop: "1em"
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.setState({ open: false });
                  }}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

EnumCellRenderer.propTypes = {
  labelProvider: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  showImage: PropTypes.bool
};

EnumCellRenderer.defaultProps = {
  showImage: true
};

export default compose(withStyles(styles))(EnumCellRenderer);
