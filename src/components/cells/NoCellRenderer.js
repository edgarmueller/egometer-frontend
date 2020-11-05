import React from "react";
import ReportIcon from "@material-ui/icons/Report";

const NoCellRenderer = () => (
  <div style={{ color: "red" }}>
    <ReportIcon />
  </div>
);
NoCellRenderer.displayName = "NoCellRenderer";
export default NoCellRenderer;
