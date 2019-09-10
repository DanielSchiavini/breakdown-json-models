import {invalidType, Field} from '..';

export default class ListField<TExternal, TInternal = TExternal> extends Field<TExternal[], TInternal[]> {
    protected constructor(private items: Field<TExternal, TInternal>, description: string) {
        super(description);
    }

    /**
     * Creates a new list field.
     * @param field The field schema of each of the items.
     * @return The created field.
     */
    static of<TExternal, TInternal>(field: Field<TExternal, TInternal>) {
        return new ListField(field.asRequired(), field.description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: (TExternal|TInternal)[] | null): TInternal[] {
        if (Array.isArray(value)) {
            return value.map((item, index) => this.items.set(`${key}[${index}]`, item));
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
    serialize(key: string, value: TInternal[]): TExternal[] {
        return value.map((item, index) => this.items.serialize(`${key}[${index}]`, item));
    }
}
