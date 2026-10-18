import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/** A placeholder for content that doesn't exist yet. */
const EmptyState = ({ icon, title, children, action }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      py: 8,
      px: 2,
      textAlign: "center",
      color: "text.secondary",
    }}
  >
    {icon}
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    {children && <Typography sx={{ maxWidth: 420 }}>{children}</Typography>}
    {action && <Box sx={{ mt: 2 }}>{action}</Box>}
  </Box>
);

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  action: PropTypes.node,
};

export default EmptyState;
