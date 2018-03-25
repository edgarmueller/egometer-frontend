import React from "react";
import Icon from "@material-ui/icons/LocalDrink";
import numberWidget from "../common/numberWidget";

const WaterConsumptionWidget = {
  ...numberWidget,
  name: "WaterConsumption",
  label: "Water Consumption",
  icon: <Icon />, // use icon in renderer as well
  category: "Health"
};

export default WaterConsumptionWidget;
