import {Field, invalidFormat, invalidType} from '..';

export default class StringField extends Field<string> {
    /**
     * Creates a new string field.
     * @param description The description of the field.
     * @param regex An optional regex to validate the field with.
     */
    protected constructor(description: string, private regex: RegExp = null) {
        super(description);
    }

    /**
     * Creates a new string field.
     * @param description The description of the field.
     * @return The created field.
     */
    static create(description: string) {
        return new StringField(description);
    }

    /**
     * Adds a regex validation to the string field.
     * @param regex The regex to validate the field with.
     * @return this
     */
    withRegex(regex: RegExp): this {
        this.regex = regex;
        return this;
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type, but it should not be null.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: any): string {
        if (typeof value === 'string') {
            if (this.regex && !this.regex.test(value)) {
                throw invalidFormat(key, value, this.regex.toString());
            }
            return value.trim();
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
    serialize(key: string, value: string): string {
        return value;
    }
}
