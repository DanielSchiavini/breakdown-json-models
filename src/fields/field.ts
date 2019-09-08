/**
 * Defines an interface for all schema fields.
 */
import {fieldRequired} from '../errors/validation-errors';

export default abstract class Field<TExternal, TInternal = TExternal> {
    /**
     * Creates a new field.
     * @param descriptionText The description of the field.
     * @param options Settings for the field.
     */
    protected constructor(private descriptionText: string, private options: {required?: boolean} = {}) {}

    /**
     * Gets the description of the field.
     */
    public get description() {
        return this.descriptionText;
    }

    /**
     * Marks this field as required.
     * @return this
     */
    asRequired(): this {
        this.options.required = true;
        return this;
    }

    /**
     * Gets the value of the field or its default value. This raises an error if the field is required and has no value yet.
     * @param key The attribute name of the field in the model.
     * @param value The value of the field.
     * @return The parsed value.
     */
    get(key: string, value?: TInternal | undefined): TInternal | undefined {
        const {required} = this.options;
        if (required && value == null) {
            throw fieldRequired(key);
        }
        return value === undefined ? null : value;
    }

    /**
     * Generates this field documentation in yuml format {@link https://yuml.me/diagram/scruffy/class/draw}
     */
    yuml(key: string): [string, string] {
        return [`${key}:${this.typeName}`, this.yuml()];
    }

    abstract get yuml(): string;
    abstract get typeName(): string;

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    abstract set(key: string, value: TExternal | TInternal): TInternal | null;

    /**
     * Converts the value from the internal format to the external format.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse.
     * @return The parsed value.
     * @throws ValidationError
     */
    abstract serialize(key: string, value: TInternal): TExternal;
}
