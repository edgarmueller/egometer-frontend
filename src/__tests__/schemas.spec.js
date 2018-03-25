import schemaReducer from '../reducers/schemas';

describe('schemas reducer', () => {
  it('should return the initial state', () => {
    expect(schemaReducer(undefined, {})).toEqual({
        isPending: false,
        schemas: []
    });
  });
});