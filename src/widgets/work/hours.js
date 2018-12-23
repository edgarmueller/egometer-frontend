import React from "react";
import TimerIcon from "@material-ui/icons/Timer";
import NumberCell from "../../components/widgets/cells/NumberCell";
import { isNumberOrInteger } from "../../common/testers";
import numberSliderWidget from "../common/numberSliderWidget";
import NumberSlider, { withMinMaxStep } from "../../components/widgets/daily/NumberSlider";

const WorkingHoursWidget = {
  ...numberSliderWidget,
  day: withMinMaxStep({ min: 0, max: 16, step: 0.25 })(NumberSlider),
  name: "WorkingHours",
  schemaId: "MinimumOf0",
  label: "Working Hours",
  icon: <TimerIcon />,
  category: "Work",
  cell: NumberCell,
  isApplicable: s => (isNumberOrInteger(s) ? 1 : -1),
  h: 1
};

export default WorkingHoursWidget;
