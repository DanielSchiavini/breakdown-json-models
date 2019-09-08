/**
 * Creates a field that can contains any of two types of field.
 */
import Field from './field';


export default class UnionField<TExternal1, TExternal2, TInternal1, TInternal2>
    extends Field<TExternal1 | TExternal2, TInternal1 | TInternal2> {

    protected constructor(private fields: [Field<TExternal1, TInternal1>, Field<TExternal2, TInternal2>], description: string) {
        super(description);
    }

    /**
     * Creates a new embedded field.
     * @param field1 The first field that is allowed.
     * @param field2 The second fields that is allowed.
     * @param description The description of the field.
     * @return The created field.
     */
    static of<TExternal1, TExternal2, TInternal1, TInternal2>(
        field1: Field<TExternal1, TInternal1>,
        field2: Field<TExternal2, TInternal2>,
        description?: string
    ): UnionField<TExternal1, TExternal2, TInternal1, TInternal2> {
        description = description || `Either ${field1.description.toLocaleLowerCase()} or ${field2.description.toLocaleLowerCase()}`;
        return new UnionField([field1, field2], description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: TExternal1 | TExternal2 | TInternal1 | TInternal2): TInternal1 | TInternal2 {
        const [field1, field2] = this.fields;
        try {
            const value1 = value as TInternal1 | TExternal1;
            return field1.set(key, value1);
        } catch (e) {
            const value2 = value as TInternal2 | TExternal2;
            return field2.set(key, value2);
        }
    }

    /**
     * Converts the value from the internal format to the external format.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse.
     * @return The parsed value.
     * @throws ValidationError
     */
    serialize(key: string, value: TInternal1 | TInternal2): TExternal1 | TExternal2 {
        const [field1, field2] = this.fields;
        try {
            // by calling set we validate that the field value is a valid TInternal1
            return field1.serialize(key, field1.set(key, value as TInternal1));
        } catch (e) {
            return field2.serialize(key, value as TInternal2);
        }
    }
}
