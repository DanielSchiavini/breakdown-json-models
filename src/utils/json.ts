import Model, {ModelConstructor} from '../schema/model';
import ResponseError from '../errors/response-error';
import {dataFieldRequired, jsonBodyRequired} from '../errors/http-errors';

/**
 * Converts the given object to a JSON string.
 * @param value The object to convert.
 * @return A nicely formatted JSON string.
 */
export function stringify(value: any) {
    return JSON.stringify(value, null, 2);
}

/**
 * Creates a JSON body for the given model(s).
 * @param model The data to be converted.
 * @return The JSON string.
 */
export function makeJsonBody(model: Model | Model[]): string {
    let data;
    if (model instanceof Array) {
        data = model.map(item => item.serialize());
    } else {
        data = model.serialize();
    }
    return stringify({data});
}

/**
 * Creates a JSON string for the given error.
 * @param error The error object, including at least an unique error code, a translatable title and a .
 * @return The JSON string.
 */
export function makeJsonError(error: ResponseError): string {
    return stringify({errors: [error]});
}

/**
 * Parses and validates the model in the responseBody.
 * @param bodyData The data to be parsed.
 * @param constructor The function that will construct the model.
 * @param validate Whether the model should be validated for required fields.
 * @return The parse object or null.
 */
export function parseModel<T extends Model>(bodyData: string | null, constructor: ModelConstructor<T>, validate: boolean = true): T {
    const parsed = tryParseJson(bodyData) as {data: any};
    if (!parsed) {
        throw jsonBodyRequired();
    }
    if (!parsed.data) {
        throw dataFieldRequired();
    }
    const model = new constructor(parsed.data);
    if (validate) {
        model.validate();
    }
    return model;
}

/**
 * Tries to parse the given string as JSON, returning null if the JSON was not valid.
 * @param data The data to be parsed.
 * @return The parse object or null.
 */
export function tryParseJson(data: string): any | null {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.log('Cannot parse JSON data', data);
        return null;
    }
}
