import React from "react";
import SentimentVerySatisfiedRounded from "@material-ui/icons/SentimentVerySatisfiedRounded";
import SentimentSatisfiedRounded from "@material-ui/icons/SentimentSatisfiedRounded";
import SentimentSatisfied from "@material-ui/icons/SentimentSatisfied";
import SentimentDissatisfiedRounded from "@material-ui/icons/SentimentDissatisfiedRounded";
import SentimentVeryDissatisfiedRounded from "@material-ui/icons/SentimentVeryDissatisfiedRounded";
import { withProps } from "recompose";

import EnumLineChart from "../../components/visualizations/EnumLineChart";
import DailyEnum from "../../components/widgets/daily/Enum";
import EnumCell from "../../components/widgets/cells/EnumCell";
import {
  literalLabelProvider,
  withImages,
  withLabels
} from "../../components/widgets/util";
import { isEnum, isString } from "../../common/testers";

const labelProvider = withLabels(
  literalLabelProvider({
    bad: "awful",
    down: "down",
    okayish: "okayish",
    good: "good",
    dabomb: "superduper"
  })
);

export const withMoodImageAndLabelProvider = Component =>
  withImages((color, isSelected, value) => {
    return withProps({
      color: isSelected ? color : "black"
    })(props => {
      switch (value) {
        case "dabomb":
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
        case "okayish":
          return (
            <SentimentSatisfied
              style={{ color: isSelected ? color : "black" }}
            />
          );
        case "down":
          return (
            <SentimentDissatisfiedRounded
              style={{ color: isSelected ? color : "black" }}
            />
          );
        case "bad":
          return (
            <SentimentVeryDissatisfiedRounded
              style={{ color: isSelected ? color : "black" }}
            />
          );
        default:
          return null;
      }
    })();
  })(labelProvider(Component));

export const MoodMeter = {
  name: "EnumMood",
  schemaId: "Mood",
  label: "Mood",
  icon: <SentimentSatisfiedRounded />,
  category: "General",
  day: withMoodImageAndLabelProvider(DailyEnum),
  month: labelProvider(EnumLineChart),
  cell: withMoodImageAndLabelProvider(EnumCell),
  isApplicable: schema => (isString(schema) && isEnum(schema) ? 2 : -1),
};

export default MoodMeter;
