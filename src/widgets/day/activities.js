import React from "react";
import Icon from "@material-ui/icons/Category";
import Ionicon from "react-ionicons";
import { withProps } from "recompose";
import MultiEnum from "../../components/widgets/daily/MultiEnum";
import MultiEnumCell from "../../components/widgets/cells/MultiEnumCell";
import { isArray } from "../../common/testers";
import {
  defaultLiteralLabelProvider,
  withImages,
  withLabels
} from "../../components/widgets/util";
import MultiEnumPieChart from "../../components/visualizations/MultiEnumPieChart";

const icons = {
  work: "md-cash",
  chill: "md-sunny",
  friends: "md-contacts",
  love: "md-heart",
  sports: "md-bicycle",
  party: "md-beer",
  movies: "md-film",
  reading: "md-book",
  gaming: "md-game-controller-b",
  shopping: "md-basket",
  traveling: "md-plane",
  food: "md-restaurant",
  nature: "md-leaf",
  cleaning: "md-home",
  pet_project: "md-star"
};

const imageProvider = (color, isSelected, value) => {
  const Icon = props => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer"
      }}
    >
      <Ionicon {...props} />
    </div>
  );
  return withProps({
    icon: icons[value],
    color: isSelected ? color : "black"
  })(Icon)();
};

const withImageProvider = withImages(imageProvider);
const ActivitiesMeter = {
  schemaId: "Activities",
  name: "Activity tags",
  label: "Activities",
  category: "General",
  icon: <Icon />,
  day: withImageProvider(withLabels(defaultLiteralLabelProvider)(MultiEnum)),
  month: MultiEnumPieChart,
  cell: withImageProvider(
    withLabels(defaultLiteralLabelProvider)(MultiEnumCell)
  ),
  isApplicable: s => (isArray(s) ? 1 : -1),
  h: 2
};

export default ActivitiesMeter;
