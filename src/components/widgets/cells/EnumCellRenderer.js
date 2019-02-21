import * as React from "react";
import * as PropTypes from "prop-types";
import * as _ from "lodash";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import EnumSelectionDialog from "./EnumSelectionDialog";

const styles = {
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
      selected: props.data || []
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

  handleClick = value => ev => {
    const { updateEntry, closeOnSelect } = this.props;
    const selected = this.state.selected.slice();
    const selectedIdx = this.state.selected.indexOf(value);
    if (selectedIdx === -1) {
      selected.push(value);
    } else {
      selected.splice(selectedIdx, 1);
    }
    updateEntry(value);
    this.setState({
      open: !closeOnSelect,
      selected
    });
  };

  closeDialog = () => this.setState({ open: false });

  render() {
    const {
      classes,
      imageProvider,
      labelProvider,
      schema,
      color,
      showImage,
      date,
      data
    } = this.props;

    if (_.isEmpty(schema)) {
      return null;
    }
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
        <EnumSelectionDialog
          schema={schema}
          color={color}
          selected={this.state.selected}
          date={date}
          labelProvider={labelProvider}
          imageProvider={imageProvider}
          open={this.state.open}
          onClose={this.closeDialog}
          onSelect={this.handleClick}
        />
      </React.Fragment>
    );
  }
}

EnumCellRenderer.propTypes = {
  labelProvider: PropTypes.func.isRequired,
  showImage: PropTypes.bool
};

EnumCellRenderer.defaultProps = {
  showImage: true
};

export default compose(withStyles(styles))(EnumCellRenderer);
