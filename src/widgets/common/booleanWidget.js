import DailyBoolean from "../../components/widgets/daily/Boolean";
import { isBoolean } from "../../common/testers";
import BooleanStats from "../../components/visualizations/BooleanStats";
import BooleanCell from "../../components/widgets/cells/BooleanCell";

const BooleanWidget = {
  schemaId: "Boolean",
  day: DailyBoolean,
  week: undefined,
  month: BooleanStats,
  cell: BooleanCell,
  isApplicable: (s) => (isBoolean(s) ? 1 : -1),
  h: 1,
};

export default BooleanWidget;
