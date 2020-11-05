import DailyString from "../../components/widgets/daily/String";
import { isString } from "../../common/testers";
import { StringCell } from "../../components/widgets/cells/StringCell";

const StringWidget = {
  schemaId: "String",
  day: DailyString,
  week: undefined,
  month: undefined,
  cell: StringCell,
  isApplicable: (s) => (isString(s) ? 1 : -1),
  h: 1,
};

export default StringWidget;
