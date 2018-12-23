import { isNumber } from "../../common/testers";
import NumberBarChart from "../../components/visualizations/NumberBarChart";
import NumberCell from "../../components/widgets/cells/NumberCell";
import NumberSlider, { withMinMaxStep } from "../../components/widgets/daily/NumberSlider";

const NumberWidget = {
  schemaId: "Number",
  month: NumberBarChart,
  cell: NumberCell,
  isApplicable: s => (isNumber(s) ? 1 : -1),
  h: 1
};

export default NumberWidget;
