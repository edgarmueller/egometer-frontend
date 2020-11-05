import DailyNumber from "../../components/widgets/daily/Number";
import { isNumber } from "../../common/testers";
import NumberBarChart from "../../components/visualizations/NumberBarChart";
import NumberCell from "../../components/widgets/cells/NumberCell";

const NumberWidget = {
  schemaId: "Number",
  day: DailyNumber,
  week: NumberBarChart,
  month: NumberBarChart,
  cell: NumberCell,
  isApplicable: (s) => (isNumber(s) ? 1 : -1),
  h: 1,
};

export default NumberWidget;
