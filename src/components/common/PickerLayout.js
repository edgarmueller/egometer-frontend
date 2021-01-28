import React from "react";
import PropTypes from "prop-types";
import ErrorSnackbar from "../common/ErrorSnackbar";
import { Grid } from "@material-ui/core";

const PickerLayout = ({ picker, children }) => (
  <div>
    <ErrorSnackbar />
    <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
      <Grid container justify="flex-start">
        <Grid item sm={12} md={3}>
          {picker}
        </Grid>
        <Grid item sm={12} md={9}>
          {children}
        </Grid>
      </Grid>
    </div>
  </div>
);

PickerLayout.propTypes = {
  picker: PropTypes.node,
  children: PropTypes.node,
};

export default PickerLayout;
