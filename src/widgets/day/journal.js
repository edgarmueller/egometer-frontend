import React from "react";
import BookIcon from "@material-ui/icons/Book";
import StringWidget from "../../components/widgets/daily/String";
import StringCell from "../../components/widgets/cells/StringCell";
import { isString } from "../../common/testers";

export const journalVis = {
  name: "String",
  schemaId: "String",
  category: "General",
  label: "Journal",
  icon: <BookIcon />,
  day: StringWidget,
  month: undefined,
  cell: StringCell,
  isApplicable: s => (isString(s) ? 1 : -1),
  h: 1
};

export default journalVis;
