import _ from "lodash";

export const findBySchemaId = (schemas, schemaId) => {
  const foundSchema = _.find(schemas, (schema) => schema.id === schemaId);
  if (foundSchema !== undefined) {
    return foundSchema.schema;
  }
  return undefined;
};

export const findBySchemaName = (schemas, schemaName) => {
  const foundSchema = _.find(schemas, (schema) => schema.name === schemaName);
  if (foundSchema !== undefined) {
    return foundSchema;
  }
  return undefined;
};
