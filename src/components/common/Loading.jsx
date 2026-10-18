import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
    <CircularProgress aria-label="Loading" />
  </Box>
);

export default Loading;
