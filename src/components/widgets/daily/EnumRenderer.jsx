import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { meterTitle, titleWrapper, underline } from "../../../common/styles";
import { defaultLiteralLabelProvider } from "../util";
import IconButtonWithLabel from "../../common/IconButtonWithLabel";
import TitleBar from "./TitleBar";

const styles = {
  meterTitle,
  titleWrapper,
  underline,
};

class EnumRenderer extends Component {
  updateEntry = (value) => () => {
    this.props.updateEntry(value);
  };

  render() {
    const {
      meter,
      width,
      height,
      schema,
      labelProvider,
      imageProvider,
      isSelected,
      icon,
    } = this.props;

    if (schema === undefined) {
      return null;
    }

    const labelMapping = schema.enum.map((literal) => [
      labelProvider(literal),
      literal,
    ]);

    return (
      <div
        style={{
          width: width,
          height: height,
        }}
      >
        <TitleBar meter={meter} icon={icon} />
        <Grid container wrap={"wrap"} justify="space-around">
          {labelMapping.map(([label, value]) => {
            return (
              <Grid item key={label}>
                <IconButtonWithLabel
                  key={label}
                  onSubmit={this.updateEntry(value)}
                  label={label}
                  icon={
                    imageProvider
                      ? imageProvider({
                          selectionColor: meter.color,
                          isSelected: isSelected(value),
                          value,
                        })
                      : null
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

EnumRenderer.propTypes = {
  schema: PropTypes.object,
  labelProvider: PropTypes.func,
  imageProvider: PropTypes.func,
  isSelected: PropTypes.func,
  meter: PropTypes.object,
  updateEntry: PropTypes.func,
  icon: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number,
};

EnumRenderer.defaultProps = {
  labelProvider: defaultLiteralLabelProvider,
  imageProvider: undefined,
};

export default withStyles(styles)(EnumRenderer);
