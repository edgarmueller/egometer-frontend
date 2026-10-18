import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BoltRounded from "@mui/icons-material/BoltRounded";

const Logo = () => (
  <Box
    component={Link}
    to="/"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 1,
      color: "text.primary",
      textDecoration: "none",
    }}
  >
    <Box
      sx={{
        display: "flex",
        p: 0.5,
        borderRadius: 2,
        color: "primary.contrastText",
        bgcolor: "primary.main",
      }}
    >
      <BoltRounded fontSize="small" />
    </Box>
    <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
      egometer
    </Typography>
  </Box>
);

export default Logo;
