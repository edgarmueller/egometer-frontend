import React from "react";
import Icon from "@material-ui/icons/Brush";
import booleanWidget from "../common/booleanWidget";

const BrushWidget = {
  ...booleanWidget,
  name: "Painting",
  label: "Painting",
  icon: <Icon />,
  category: "Hobbies"
};

export default BrushWidget;
