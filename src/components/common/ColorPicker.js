import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

// TODO the only usage of react css, can we remove it?
const styles = reactCSS({
  default: {
    swatch: {
      padding: "5px",
      background: "#fff",
      borderRadius: "1px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
      display: "inline-block",
      cursor: "pointer",
      margin: 5
    },
    popover: {
      position: "absolute",
      zIndex: "2"
    },
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px"
    }
  }
});

export class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      color: props.color
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.color !== prevProps.color) {
      this.setState({ color: this.props.color })
    }
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = color => {
    this.setState({ color: color.hex });
  };

  handleChangeComplete = color => {
    this.props.onChangeComplete(color.hex);
  };

  render() {
    return (
      <Fragment>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div
            style={{
              height: 25,
              width: 25,
              borderRadius: "50%",
              backgroundColor: this.state.color,
              border: "none"
            }}
          />
        </div>
        {this.state.open ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={(color, event) => {
                this.props.onChange(color.hex);
                this.handleChange(color);
                event.stopPropagation();
              }}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        ) : null}
      </Fragment>
    );
  }
}

ColorPicker.propTypes = {
  onChange: PropTypes.func,
  onChangeComplete: PropTypes.func
}

export default withStyles(styles)(ColorPicker);
