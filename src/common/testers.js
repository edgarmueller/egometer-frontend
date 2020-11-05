import * as _ from "lodash";

export const isNumberOrInteger = (schema) =>
  isNumber(schema) || isInteger(schema);

export const isNumber = (schema) => hasType(schema, "number");
export const isInteger = (schema) => hasType(schema, "integer");
export const isString = (schema) => hasType(schema, "string");
export const isEnum = (schema) => schema.enum !== undefined;
export const isBoolean = (schema) => hasType(schema, "boolean");
export const isArray = (schema) => hasType(schema, "array");

export const hasType = (schema, expectedType) => {
  return (
    schema.type === expectedType ||
    (_.isArray(schema.type) && schema.type.indexOf(expectedType) !== -1)
  );
};
