import React from "react";
import Icon from "@material-ui/icons/LooksOne";
import numberWidget from "../common/numberWidget";

const CustomNumberWidget = {
  ...numberWidget,
  name: "Number",
  label: "number",
  icon: <Icon />,
};

export default CustomNumberWidget;
