import journal from "./day/journal";
import mood from "./day/mood";
import activities from "./day/activities";
import quantity from "./day/quantity";
import workingHours from "./work/hours";
import noAlcohol from "./health/alcohol";
import waterConsumption from "./health/water";
import sleep from "./health/sleep";
import painting from "./hobbies/painting";
import customBoolean from "./custom/customBoolean";
import customNumber from "./custom/customNumber";
import customString from "./custom/customString";

// TODO: should we move name into the component?
export default [
  workingHours,
  mood,
  journal,
  noAlcohol,
  waterConsumption,
  sleep,
  painting,
  activities,
  quantity,
  customBoolean,
  customNumber,
  customString
];
