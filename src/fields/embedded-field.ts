import {Field, Model, ModelConstructor, ModelProperties, invalidType} from '..';

/**
 * Creates a field that references another model.
 */
export default class EmbeddedField<TModel extends Model> extends Field<ModelProperties, TModel> {
    protected constructor(private model: ModelConstructor<TModel>, description: string) {
        super(description);
    }

    /**
     * Creates a new embedded field.
     * @param constructor The constructor of the model that will be referenced.
     * @param description The description of the field.
     * @return The created field.
     */
    static of<T extends Model>(constructor: ModelConstructor<T>, description: string): EmbeddedField<T> {
        return new EmbeddedField(constructor, description);
    }

    /**
     * Parses and validates the given value, throwing an error if the value is invalid.
     * @param key The attribute name of the field in the model.
     * @param value The value to parse. It may be either the internal or the external type.
     * @return The parsed value.
     * @throws ValidationError
     */
    set(key: string, value: ModelProperties | TModel): TModel {
        if (value.constructor === this.model) {
            return value as TModel;
        }
        if (value.constructor === Object) {
            return new this.model(value);
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
    serialize(key: string, value: TModel): ModelProperties {
        return value.serialize();
    }
}
