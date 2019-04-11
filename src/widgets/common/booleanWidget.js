import GenericCell from "../../components/widgets/cells/GenericCell";
import DailyBoolean from "../../components/widgets/daily/Boolean";
import { isBoolean } from "../../common/testers";
import BooleanStats from "../../components/visualizations/BooleanStats";

const BooleanWidget = {
  schemaId: "Boolean",
  day: DailyBoolean,
  week: undefined,
  month: BooleanStats,
  cell: GenericCell,
  isApplicable: s => (isBoolean(s) ? 1 : -1),
  h: 1
};

export default BooleanWidget;
