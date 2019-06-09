import Field from './field';
import {invalidEnumValue} from '../errors/validation-errors';
import {Mapping, transformObject} from '../utils/objects';

/**
 * Class responsible for validating enum fields.
 */
export default class EnumField<T> extends Field<string, T> {
    /** A mapping of the enum values to their respective keys. */
    private readonly valueToKey: Mapping<string>;

    private constructor(private enumType: any, description: string) {
        super(description);
        this.valueToKey = transformObject(enumType, (value, key) => [value.toString(), key]);
    }

    /**
     * Creates a new enum field for the given enum type.
     * @param enumType The type of the enum.
     * @param description The description of the field.
     * @return The created field.
     */
    static of<T>(enumType: any, description: string) {
        return new EnumField<T>(enumType, description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: string | T): T {
        if (this.valueToKey.hasOwnProperty(value as string)) {
            return value as T;
        }
        if (this.enumType.hasOwnProperty(value as string)) {
            value = this.enumType[value];
            return value as T;
        }
        throw invalidEnumValue(key, value);
    }

    /**
     * Converts the value from the internal format to the external format.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse.
     * @return The parsed value.
     * @throws ValidationError
     */
    serialize(key: string, value: T): string {
        return this.valueToKey[value.toString()];
    }
}
