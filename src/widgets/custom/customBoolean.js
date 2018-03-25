import React from "react";
import Icon from "@material-ui/icons/CheckBox";
import booleanWidget from "../common/booleanWidget";

const CustomBooleanWidget = {
  ...booleanWidget,
  name: "Boolean",
  label: "yes/no",
  icon: <Icon />,
  category: "Custom"
};

export default CustomBooleanWidget;
