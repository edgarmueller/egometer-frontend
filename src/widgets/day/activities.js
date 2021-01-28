import React from "react";
import CategoryIcon from "@material-ui/icons/Category";
import Ionicon from "react-ionicons";
import PropTypes from "prop-types";
import MultiEnum from "../../components/widgets/daily/MultiEnum";
import MultiEnumCell from "../../components/widgets/cells/MultiEnumCell";
import { isArray } from "../../common/testers";
import {
  defaultLiteralLabelProvider,
  withImages,
  withLabels,
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
  cleaning: "md-trash",
  pet_project: "md-star",
  family: "md-home",
  sick: "md-thermometer",
  learning: "md-create",
  health: "md-medical",
};

const Icon = ({ selectionColor, isSelected, value }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Ionicon
        icon={icons[value]}
        color={isSelected ? selectionColor : "black"}
      />
    </div>
  );
};

Icon.propTypes = {
  selectionColor: PropTypes.string,
  isSelected: PropTypes.boolean,
  value: PropTypes.any,
};

const withImageProvider = withImages(Icon);

const ActivitiesMeter = {
  schemaId: "Activities",
  name: "Activity tags",
  label: "Activities",
  category: "General",
  icon: <CategoryIcon />,
  day: withImageProvider(withLabels(defaultLiteralLabelProvider)(MultiEnum)),
  week: MultiEnumPieChart,
  month: MultiEnumPieChart,
  cell: withImageProvider(
    withLabels(defaultLiteralLabelProvider)(MultiEnumCell)
  ),
  isApplicable: (s) => (isArray(s) ? 1 : -1),
};

export default ActivitiesMeter;
