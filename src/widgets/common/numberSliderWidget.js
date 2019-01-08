import { isNumber } from "../../common/testers";
import NumberBarChart from "../../components/visualizations/NumberBarChart";
import NumberCell from "../../components/widgets/cells/NumberCell";

export default {
  schemaId: "Number",
  month: NumberBarChart,
  cell: NumberCell,
  isApplicable: s => (isNumber(s) ? 1 : -1),
  h: 1
};
