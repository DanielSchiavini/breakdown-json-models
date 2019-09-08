import Field from './field';
import {invalidFormat, invalidType} from '../errors/validation-errors';

/**
 * A field containing a javascript Date object internally, that serializes to JSON ISO string.
 */
export default class IsoDateField extends Field<String, Date> {
    protected constructor(description: string) {
        super(description);
    }

    /**
     * Creates a new date field.
     * @param description The description of the field.
     * @return The created field.
     */
    static create(description: string) {
        return new IsoDateField(description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: any): Date {
        if (value.isPrototypeOf(Date)) {
            return value;
        }
        if (typeof value == 'string') {
            const parsed = new Date(Date.parse(value));
            if (!parsed) {
                throw invalidFormat(key, value, 'ISO 8601 (e.g. "2019-08-30T23:59:00.171Z")');
            }
            return parsed;
        }
        throw invalidType(key, value);
    }

    /**
     * Converts the value from the internal format to the external format.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse.
     * @return The parsed value.
     * @throws ValidationError
     */
    serialize(key: string, value: Date): string {
        return value.toISOString();
    }
}
