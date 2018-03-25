import React from "react";
import Icon from "@material-ui/icons/LocalBar";
import booleanWidget from "../common/booleanWidget";

const NoAlcoholWidget = {
  ...booleanWidget,
  name: "NoAlcohol",
  label: "No Alcohol",
  icon: <Icon />, // use icon in renderer as well
  category: "Health"
};

export default NoAlcoholWidget;

// pre-defined meter creation for convenience
// 1. meter name set
// 2. make use of provided icon
// 3. possible use of better widgets?
