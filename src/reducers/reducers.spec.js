import { getEntriesByMeter, getProgressByMeter, getMeterError, getSchemas, findBySchemaName, getEntriesError, isSchemasLoading, isMetersLoading, getSchemaError, findMeterById } from ".";

describe('Reducer getters', () => {
    it('should return entries by meter', () => {
        expect(getEntriesByMeter({
            entries: {
                entries: { foo: 'bar' }
            }
        })).toEqual({ foo: 'bar' })
    });

    it('should return entries by meter', () => {
        expect(getProgressByMeter({
            entries: {
                progressByMeter: { foo: 42 }
            }
        })).toEqual({ foo: 42 })
    });

    it('should return schemas', () => {
        expect(getSchemas({
            schemas: {
                schemas: [{ type: 'object' }]
            }
        })).toHaveLength(1);
    });

    it('should find a meter by an id', () => {
        expect(
          findMeterById("foo")({
            meters: {
              meters: [{
                  id: 'foo',
                  meter: 'test'
              }]
            }
          })
        ).toEqual({
            id: 'foo',
            meter: 'test'
        });
    });

    it('should find a schema by name', () => {
        expect(findBySchemaName('fooSchema')({
            schemas: {
                schemas: [{
                    name: 'fooSchema',
                    schema: { type: 'number' }
                }]
            }
        })).toEqual({ 
            name: 'fooSchema',
            schema: { type: 'number' }
        });
    });

    it('should return loading status of schemas', () => {
        expect(isSchemasLoading({
            schemas: {
                isPending: true
            }
        })).toBe(true);
    });

    it('should return loading status of meters', () => {
        expect(isMetersLoading({
            meters: {
                isLoading: true
            }
        })).toBe(true);
    });

    it('should return schemas error', () => {
        expect(getSchemaError({
            schemas: {
               error: 'Unknown error'
            }
        })).toEqual('Unknown error');
    });

    it('should return meter errors', () => {
        expect(getMeterError({
            meters: {
               error: 'Unknown error'
            }
        })).toEqual('Unknown error');
    });

    it('should return entries errors', () => {
        expect(getEntriesError({
            entries: {
               error: 'Unknown error'
            }
        })).toEqual('Unknown error');
    });
});