import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/** The title of a page, with the page's actions to its right. */
const PageHeader = ({ title, subtitle, children }) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
      mb: 3,
    }}
  >
    <Box>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {children && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {children}
      </Box>
    )}
  </Box>
);

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  children: PropTypes.node,
};

export default PageHeader;
