import * as _ from 'lodash';
import { FETCH_SCHEMAS_SUCCESS, FETCH_SCHEMAS_REQUEST, FETCH_SCHEMAS_FAILURE } from "../actions";

const initialState = {
    isPending: false,
    schemas: [],
    error: undefined
};

const schemaReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SCHEMAS_REQUEST:
            return {
                ...state,
                isPending: true,
            }
        case FETCH_SCHEMAS_SUCCESS:
            return {
                isPending: false,
                schemas: action.schemas
            }
        case FETCH_SCHEMAS_FAILURE:
            return {
                ...state,
                isPending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getSchemas = state => state.schemas;
export const getSchemaError = state => state.error;
export const findBySchemaId = schemaId => state => {
    const result = _.filter(state.schemas, schema => schema.id === schemaId);
    if (result.length > 0) {
        return _.head(result);
    }
    return undefined;
};
export const findBySchemaName = schemaName => state => {
    const result = _.filter(state.schemas, schema => schema.name === schemaName);
    if (result.length > 0) {
        return _.head(result);
    }
    return undefined;
};

export default schemaReducer;
