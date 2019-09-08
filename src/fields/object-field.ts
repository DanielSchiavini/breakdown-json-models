import {invalidType, Field} from '..';

export default class ObjectField extends Field<object> {
    protected constructor(description: string) {
        super(description);
    }

    /**
     * Creates a new object field.
     * @param description The description of the field.
     * @return The created field.
     */
    static create(description: string) {
        return new ObjectField(description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: any): object {
        if (typeof value === 'object') {
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
    serialize(key: string, value: object): object {
        return value;
    }
}
