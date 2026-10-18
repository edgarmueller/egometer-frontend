import React from "react";
import SentimentVerySatisfiedRounded from "@material-ui/icons/SentimentVerySatisfiedRounded";
import SentimentSatisfiedRounded from "@material-ui/icons/SentimentSatisfiedRounded";
import SentimentSatisfied from "@material-ui/icons/SentimentSatisfied";
import SentimentDissatisfiedRounded from "@material-ui/icons/SentimentDissatisfiedRounded";
import SentimentVeryDissatisfiedRounded from "@material-ui/icons/SentimentVeryDissatisfiedRounded";

import EnumLineChart from "../../components/visualizations/EnumLineChart";
import DailyEnum from "../../components/widgets/daily/Enum";
import EnumCell from "../../components/widgets/cells/EnumCell";
import {
  literalLabelProvider,
  withImages,
  withLabels,
} from "../../components/widgets/util";
import { isEnum, isString } from "../../common/testers";

const labelProvider = withLabels(
  literalLabelProvider({
    awful: "Awful",
    bad: "Bad",
    okay: "Okay",
    good: "Good",
    great: "Great",
  })
);

export const withMoodImageAndLabelProvider = (Component) =>
  withImages(({ selectionColor, isSelected, value }) => {
    const color = isSelected ? selectionColor : "black";
    switch (value) {
      case "great":
        return (
          <SentimentVerySatisfiedRounded
            style={{ color: isSelected ? color : "black" }}
          />
        );
      case "good":
        return (
          <SentimentSatisfiedRounded
            style={{ color: isSelected ? color : "black" }}
          />
        );
      case "okay":
        return (
          <SentimentSatisfied style={{ color: isSelected ? color : "black" }} />
        );
      case "bad":
        return (
          <SentimentDissatisfiedRounded
            style={{ color: isSelected ? color : "black" }}
          />
        );
      case "awful":
        return (
          <SentimentVeryDissatisfiedRounded
            style={{ color: isSelected ? color : "black" }}
          />
        );
      default:
        return null;
    }
  })(labelProvider(Component));

export const MoodMeter = {
  name: "EnumMood",
  meterType: "mood",
  label: "Mood",
  icon: <SentimentSatisfiedRounded />,
  category: "General",
  day: withMoodImageAndLabelProvider(DailyEnum),
  week: labelProvider(EnumLineChart),
  month: labelProvider(EnumLineChart),
  cell: withMoodImageAndLabelProvider(EnumCell),
  isApplicable: (schema) => (isString(schema) && isEnum(schema) ? 2 : -1),
};

export default MoodMeter;
