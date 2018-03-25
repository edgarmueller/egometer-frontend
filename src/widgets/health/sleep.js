import React from "react";
import Icon from "@material-ui/icons/AirlineSeatIndividualSuite";
import numberWidget from "../common/numberWidget";

const WaterConsumptionWidget = {
  ...numberWidget,
  name: "Sleep",
  label: "Sleep ",
  icon: <Icon />, // use icon in renderer as well
  category: "Health"
};

export default WaterConsumptionWidget;
