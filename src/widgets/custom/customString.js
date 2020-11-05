import React from "react";
import Icon from "@material-ui/icons/TextFields";
import stringWidget from "../common/stringWidget";

const CustomStringWidget = {
  ...stringWidget,
  name: "String",
  label: "string",
  icon: <Icon />,
};

export default CustomStringWidget;
