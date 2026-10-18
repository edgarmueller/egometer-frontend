import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";

class DefaultErrorBoundary extends React.Component {
  state = {
    isError: false,
  };

  static getDerivedStateFromError() {
    return { isError: true };
  }

  render() {
    if (!this.state.isError) {
      return this.props.children;
    }
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          pt: 12,
          px: 2,
          textAlign: "center",
        }}
      >
        <ErrorOutlineRounded color="error" sx={{ fontSize: 56 }} />
        <Typography variant="h5" component="h1">
          Sorry, something went wrong
        </Typography>
        <Typography color="text.secondary">
          Please reload the page or try again later.
        </Typography>
        <Button variant="contained" href="/">
          Back to egometer
        </Button>
      </Box>
    );
  }
}

DefaultErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultErrorBoundary;
