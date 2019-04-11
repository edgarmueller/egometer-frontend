import GenericCell from "../../components/widgets/cells/GenericCell";
import DailyString from "../../components/widgets/daily/String";
import { isString } from "../../common/testers";

const StringWidget = {
  schemaId: "String",
  day: DailyString,
  week: undefined,
  month: undefined,
  cell: GenericCell,
  isApplicable: s => (isString(s) ? 1 : -1),
  h: 1
};

export default StringWidget;
