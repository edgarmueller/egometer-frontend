import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Button from "@material-ui/core/Button/Button";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import IconButtonWithLabel from "../../common/IconButtonWithLabel";

const styles = {
  enumIcon: {
    fontSize: "2em",
    margin: "0.5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogTitle: {
    padding: "10px",
    margin: "0 auto",
    fontWeight: "bold",
  },
  closeGridItem: {
    paddingTop: "1em",
  },
};

const isSelected = (selected) => (value) => selected.includes(value);

class EnumSelectionPanel extends React.PureComponent {
  render() {
    const {
      color,
      imageProvider,
      onSelect,
      classes,
      schema,
      labelProvider,
      onClose,
      selected,
    } = this.props;
    const labelToLiteralMapping = schema.enum.map((literal) => [
      labelProvider(literal),
      literal,
    ]);

    return (
      <Grid container justify={"center"}>
        <Grid container wrap={"wrap"} justify="space-around">
          {labelToLiteralMapping.map(([label, value]) => {
            return (
              <Grid
                key={value}
                item
                className={classes.enumIcon}
                onClick={onSelect(value)}
              >
                <IconButtonWithLabel
                  label={label}
                  icon={
                    imageProvider
                      ? imageProvider(color, isSelected(selected)(value), value)
                      : null
                  }
                />
              </Grid>
            );
          })}
        </Grid>
        <Grid item className={classes.closeGridItem}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }
}

EnumSelectionPanel.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.string,
  imageProvider: PropTypes.func,
  labelProvider: PropTypes.func,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  schema: PropTypes.object,
  selected: PropTypes.bool,
};

class EnumSelectionDialog extends React.PureComponent {
  render() {
    const {
      classes,
      open,
      date,
      color,
      schema,
      imageProvider,
      labelProvider,
      selected,
      onClose,
      onSelect,
    } = this.props;
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle disableTypography className={classes.dialogTitle}>
          Update data for {date}
        </DialogTitle>
        <DialogContent>
          <EnumSelectionPanel
            onClose={onClose}
            color={color}
            onSelect={onSelect}
            imageProvider={imageProvider}
            labelProvider={labelProvider}
            schema={schema}
            selected={selected}
            classes={classes}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

EnumSelectionDialog.propTypes = {
  selected: PropTypes.array.isRequired,
  classes: PropTypes.object,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  date: PropTypes.string,
  color: PropTypes.string,
  imageProvider: PropTypes.func,
  labelProvider: PropTypes.func,
  schema: PropTypes.object,
};

export default withStyles(styles)(EnumSelectionDialog);
