// Mirrors the meter types of the API, see GET /api/v1/meter-types
// ordered from worst to best
export const MOOD_VALUES = ["awful", "bad", "okay", "good", "great"];
export const QUANTITY_VALUES = ["none", "a_bit", "a_lot"];

// name of the widget (see src/widgets) that displays a meter of each type
const WIDGET_BY_TYPE = {
  mood: "EnumMood",
  quantity: "Quantity Enum",
  boolean: "Boolean",
  number: "Number",
  text: "String",
  activities: "Activity tags",
};

/**
 * Describes the values of a meter's entries as a JSON schema, which is
 * what the widgets render.
 */
export const schemaForMeter = (meter) => {
  switch (meter.type) {
    case "mood":
      return { type: "string", enum: MOOD_VALUES };
    case "quantity":
      return { type: "string", enum: QUANTITY_VALUES };
    case "boolean":
      return { type: "boolean" };
    case "number":
      return { type: "number" };
    case "text":
      return { type: "string" };
    case "activities":
      return {
        type: "array",
        items: { type: "string", enum: meter.options || [] },
      };
    default:
      return undefined;
  }
};

/** Adds the widget and schema the UI needs to a meter from the API. */
export const withWidget = (meter) => ({
  ...meter,
  widget: WIDGET_BY_TYPE[meter.type],
  schema: schemaForMeter(meter),
});
