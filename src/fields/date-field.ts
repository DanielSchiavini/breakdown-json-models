import {Field, invalidFormat, invalidType} from '..';

/**
 * A field containing a javascript Date object.
 */
export default class DateField extends Field<Date> {
    protected constructor(description: string) {
        super(description);
    }

    /**
     * Creates a new date field.
     * @param description The description of the field.
     * @return The created field.
     */
    static create(description: string) {
        return new DateField(description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: any): Date {
        if (typeof value === 'string') {
            const timestamp = Date.parse(value);
            if (!timestamp) {
                throw invalidFormat(key, value, 'ISO 8601');
            }
            value = new Date(timestamp);
        }
        if (value instanceof Date) {
            return value;
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
    serialize(key: string, value: Date): Date {
        return value;
    }
}
