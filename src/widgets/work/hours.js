import React from "react";
import TimerIcon from "@material-ui/icons/Timer";
import NumberCell from "../../components/widgets/cells/NumberCell";
import { isNumberOrInteger } from "../../common/testers";
import numberWidget from "../common/numberWidget";

const WorkingHoursWidget = {
  ...numberWidget,
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
