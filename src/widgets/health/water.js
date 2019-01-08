import React from "react";
import Icon from "@material-ui/icons/LocalDrink";
import numberSliderWidget from "../common/numberSliderWidget";
import NumberSlider, {
  withMinMaxStep
} from "../../components/widgets/daily/NumberSlider";

const WaterConsumptionWidget = {
  ...numberSliderWidget,
  day: withMinMaxStep({ min: 0, max: 4, step: 0.25 })(NumberSlider),
  name: "WaterConsumption",
  label: "Water Consumption",
  icon: <Icon />, // use icon in renderer as well
  category: "Health"
};

export default WaterConsumptionWidget;
