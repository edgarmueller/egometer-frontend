export const findBySchemaId = (schemas, schemaId) => {
    const foundSchema = schemas.filter(schema => schema.id === schemaId)
    if (foundSchema !== undefined) {
        return foundSchema.schema;
    }
    return undefined;
}