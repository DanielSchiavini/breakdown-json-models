import {Field, invalidEnumValue, transformObject} from '..';


export type EnumValue = string | number | symbol;

/**
 * Class responsible for validating enum fields.
 */
export default class EnumField<T extends {[P in keyof T]: V}, K extends keyof T, V extends EnumValue>
    extends Field<K, V> {
    /** A mapping of the enum values to their respective keys. */
    private readonly valueToKey: Record<V, K>;

    private constructor(private enumType: Record<K, V>, description: string) {
        super(description);
        this.valueToKey = transformObject(enumType, (value: V, key: K) => [value, key]);
    }

    /**
     * Creates a new enum field for the given enum type.
     * @param enumType The type of the enum.
     * @param description The description of the field.
     * @return The created field.
     */
    static of<T extends {[P in keyof T]: V}, K extends keyof T, V extends EnumValue>
    (enumType: Record<K, EnumValue>, description: string) {
        return new EnumField<T, K, EnumValue>(enumType, description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: K | V): V {
        if (this.valueToKey.hasOwnProperty(value)) {
            return value as V;
        }
        if (this.enumType.hasOwnProperty(value)) {
            return this.enumType[value as K];
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
    serialize(key: string, value: V): K {
        return this.valueToKey[value.toString()];
    }
}
