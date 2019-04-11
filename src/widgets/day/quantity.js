import React from "react";
import Assessment from "@material-ui/icons/Assessment";
import Brightness1 from "@material-ui/icons/Brightness1";
import Brightness2 from "@material-ui/icons/Brightness2";
import Brightness3 from "@material-ui/icons/Brightness3";
import DailyEnum from "../../components/widgets/daily/Enum";
import EnumCell from "../../components/widgets/cells/EnumCell";
import { isEnum } from "../../common/testers";
import {
  literalLabelProvider,
  withImages,
  withLabels
} from "../../components/widgets/util";

const quantityLabels = withLabels(
  literalLabelProvider({
    none: "None",
    a_bit: "A bit",
    a_lot: "A lot"
  })
);

const quantityImages = withImages((color, isSelected, value) => {
  switch (value) {
    case "none":
      return <Brightness3 style={{ color: isSelected ? color : "black" }} />;
    case "a_bit":
      return <Brightness2 style={{ color: isSelected ? color : "black" }} />;
    case "a_lot":
      return <Brightness1 style={{ color: isSelected ? color : "black" }} />;
    default:
      return <div />;
  }
});

export const quantityEnumWidget = {
  name: "Quantity Enum",
  schemaId: "QuantityEnum",
  day: quantityLabels(quantityImages(DailyEnum)),
  label: "Quantity",
  category: "Custom",
  icon: <Assessment />,
  week: undefined,
  month: undefined,
  cell: quantityLabels(quantityImages(EnumCell)),
  // TODO: also check for enum? why do we need this at all?
  isApplicable: s => (isEnum(s) ? 1 : -1),
  h: 1
};

export default quantityEnumWidget;
