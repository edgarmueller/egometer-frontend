import React from "react";
import startCase from "lodash/startCase";
import SentimentVeryDissatisfiedRounded from "@mui/icons-material/SentimentVeryDissatisfiedRounded";
import SentimentDissatisfiedRounded from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentNeutralRounded from "@mui/icons-material/SentimentNeutralRounded";
import SentimentSatisfiedRounded from "@mui/icons-material/SentimentSatisfiedRounded";
import SentimentVerySatisfiedRounded from "@mui/icons-material/SentimentVerySatisfiedRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import ContrastRounded from "@mui/icons-material/ContrastRounded";
import CircleRounded from "@mui/icons-material/CircleRounded";
import CategoryRounded from "@mui/icons-material/CategoryRounded";
import LeaderboardRounded from "@mui/icons-material/LeaderboardRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import PinRounded from "@mui/icons-material/PinRounded";
import EditNoteRounded from "@mui/icons-material/EditNoteRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import DirectionsBikeRounded from "@mui/icons-material/DirectionsBikeRounded";
import ParkRounded from "@mui/icons-material/ParkRounded";
import FlightRounded from "@mui/icons-material/FlightRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import MovieRounded from "@mui/icons-material/MovieRounded";
import MusicNoteRounded from "@mui/icons-material/MusicNoteRounded";
import WorkRounded from "@mui/icons-material/WorkRounded";
import CleaningServicesRounded from "@mui/icons-material/CleaningServicesRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import StarRounded from "@mui/icons-material/StarRounded";
import WbSunnyRounded from "@mui/icons-material/WbSunnyRounded";
import CelebrationRounded from "@mui/icons-material/CelebrationRounded";
import ShoppingBasketRounded from "@mui/icons-material/ShoppingBasketRounded";
import RestaurantRounded from "@mui/icons-material/RestaurantRounded";
import DirectionsWalkRounded from "@mui/icons-material/DirectionsWalkRounded";
import SickRounded from "@mui/icons-material/SickRounded";
import LocalHospitalRounded from "@mui/icons-material/LocalHospitalRounded";
import LocalOfferRounded from "@mui/icons-material/LocalOfferRounded";

// Mirrors the meter types of the API, see GET /api/v1/meter-types

// ordered from worst to best
export const MOOD_VALUES = ["awful", "bad", "okay", "good", "great"];
export const QUANTITY_VALUES = ["none", "a_bit", "a_lot"];

/**
 * How the meter types are presented: their name, icon and, for types with a
 * fixed set of values, the label and icon of each value.
 */
export const METER_TYPES = {
  mood: {
    label: "Mood",
    description: "How you felt, from awful to great",
    Icon: SentimentSatisfiedRounded,
    values: MOOD_VALUES,
    valueLabels: {
      awful: "Awful",
      bad: "Bad",
      okay: "Okay",
      good: "Good",
      great: "Great",
    },
    valueIcons: {
      awful: SentimentVeryDissatisfiedRounded,
      bad: SentimentDissatisfiedRounded,
      okay: SentimentNeutralRounded,
      good: SentimentSatisfiedRounded,
      great: SentimentVerySatisfiedRounded,
    },
  },
  activities: {
    label: "Activities",
    description: "What you did, as a set of tags",
    Icon: CategoryRounded,
  },
  quantity: {
    label: "Quantity",
    description: "None, a bit or a lot of something",
    Icon: LeaderboardRounded,
    values: QUANTITY_VALUES,
    valueLabels: { none: "None", a_bit: "A bit", a_lot: "A lot" },
    valueIcons: {
      none: RadioButtonUncheckedRounded,
      a_bit: ContrastRounded,
      a_lot: CircleRounded,
    },
  },
  boolean: {
    label: "Yes / No",
    description: "Whether you did something",
    Icon: CheckCircleRounded,
  },
  number: {
    label: "Number",
    description: "A number, with optional goals",
    Icon: PinRounded,
  },
  text: {
    label: "Journal",
    description: "A note for each day",
    Icon: EditNoteRounded,
  },
};

export const meterType = (meter) => METER_TYPES[meter.type];

/** The label of a meter's type, unless the meter is named after it. */
export const typeLabel = (meter) => {
  const { label } = meterType(meter);
  return label === meter.name ? undefined : label;
};

/** Whether an entry with the value doesn't track anything. */
export const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  value === false ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const ACTIVITY_ICONS = {
  // the default options of an activities meter
  family: HomeRounded,
  friends: GroupsRounded,
  partner: FavoriteRounded,
  sports: DirectionsBikeRounded,
  outdoors: ParkRounded,
  travel: FlightRounded,
  reading: MenuBookRounded,
  gaming: SportsEsportsRounded,
  movies_tv: MovieRounded,
  music: MusicNoteRounded,
  work: WorkRounded,
  chores: CleaningServicesRounded,
  learning: SchoolRounded,
  side_project: StarRounded,
  // other tags that might be added to a meter
  chill: WbSunnyRounded,
  love: FavoriteRounded,
  party: CelebrationRounded,
  movies: MovieRounded,
  shopping: ShoppingBasketRounded,
  traveling: FlightRounded,
  food: RestaurantRounded,
  cooking: RestaurantRounded,
  nature: ParkRounded,
  walking: DirectionsWalkRounded,
  cleaning: CleaningServicesRounded,
  sick: SickRounded,
  health: LocalHospitalRounded,
};

const ACTIVITY_LABELS = {
  movies_tv: "Movies & TV",
};

// built-in tags like side_project are prettified, tags added by users
// are shown as they were typed
export const activityLabel = (tag) =>
  ACTIVITY_LABELS[tag] || (/^[a-z0-9_]+$/.test(tag) ? startCase(tag) : tag);

export const ActivityIcon = ({ tag, ...props }) => {
  const Icon =
    ACTIVITY_ICONS[tag.toLowerCase().replace(/ /g, "_")] || LocalOfferRounded;
  return <Icon {...props} />;
};

/** Formats an entry's value for display, e.g. in tooltips. */
export const formatValue = (meter, value) => {
  const type = meterType(meter);
  if (value === undefined || value === null) {
    return "";
  }
  if (type.valueLabels) {
    return type.valueLabels[value] || value;
  }
  switch (meter.type) {
    case "activities":
      return value.map(activityLabel).join(", ");
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return String(value);
  }
};
