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
  // the default options of an activities meter
  family: "md-home",
  friends: "md-contacts",
  partner: "md-heart",
  sports: "md-bicycle",
  outdoors: "md-leaf",
  travel: "md-plane",
  reading: "md-book",
  gaming: "md-game-controller-b",
  movies_tv: "md-film",
  music: "md-musical-notes",
  work: "md-cash",
  chores: "md-brush",
  learning: "md-create",
  side_project: "md-star",
  // other tags that might be added to a meter
  chill: "md-sunny",
  love: "md-heart",
  party: "md-beer",
  movies: "md-film",
  shopping: "md-basket",
  traveling: "md-plane",
  food: "md-restaurant",
  cooking: "md-restaurant",
  nature: "md-leaf",
  walking: "md-walk",
  cleaning: "md-trash",
  sick: "md-thermometer",
  health: "md-medical",
};
// for tags without an icon of their own
const DEFAULT_ICON = "md-pricetag";

const labels = {
  movies_tv: "Movies & TV",
};

// built-in tags like side_project are prettified, tags added by users
// are shown as they were typed
export const activityLabel = (tag) =>
  labels[tag] ||
  (/^[a-z0-9_]+$/.test(tag) ? defaultLiteralLabelProvider(tag) : tag);

export const activityIcon = (tag) =>
  icons[tag.toLowerCase().replace(/ /g, "_")] || DEFAULT_ICON;

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
        icon={activityIcon(value)}
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
  meterType: "activities",
  name: "Activity tags",
  label: "Activities",
  category: "General",
  icon: <CategoryIcon />,
  day: withImageProvider(withLabels(activityLabel)(MultiEnum)),
  week: withLabels(activityLabel)(MultiEnumPieChart),
  month: withLabels(activityLabel)(MultiEnumPieChart),
  cell: withImageProvider(withLabels(activityLabel)(MultiEnumCell)),
  isApplicable: (s) => (isArray(s) ? 1 : -1),
};

export default ActivitiesMeter;
