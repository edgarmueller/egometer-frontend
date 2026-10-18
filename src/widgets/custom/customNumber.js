import React from "react";
import Icon from "@material-ui/icons/LooksOne";
import numberWidget from "../common/numberWidget";

const CustomNumberWidget = {
  ...numberWidget,
  name: "Number",
  meterType: "number",
  label: "number",
  icon: <Icon />,
};

export default CustomNumberWidget;
