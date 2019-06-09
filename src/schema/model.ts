import {forEachObject, mapObject, Mapping} from '../utils/objects';
import Field from '../fields/field';

export interface ModelProperties extends Mapping<any> {}

export type ModelConstructor<T extends Model> = new(properties?: ModelProperties) => T;

/**
 * Models are responsible for defining their own fields.
 */
export default abstract class Model {

    /** The fields of the model (part of the class prototype) */
    private $fields: Mapping<Field<any>>;

    /** The data of the model */
    private readonly $data: Mapping<any> = {};

    constructor() {
        this.defineProperties();
    }

    /**
     * Adds a new field to the class.
     * @param key The key of the field.
     * @param field The field.
     */
    addField<TExternal, TInternal>(key: string, field: Field<TExternal, TInternal>): void {
        this.$fields = this.$fields || {};
        this.$fields[key] = field;
    }

    /**
     * Defines the properties based on the fields of the class.
     */
    defineProperties() {
        // hide the data field from Object.keys()
        Object.defineProperty(this, '$data', {enumerable: false, writable: false, value: this.$data});

        Object.defineProperties(this, mapObject(this.$fields, <TExternal, TInternal>(field: Field<TExternal, TInternal>, key: string) => ({
            /**
             * Gets the value of the field, delegating validation to the field.
             * @return The value of the field.
             */
            get(this: Model): TInternal {
                return field.get(key, this.$data[key]);
            },

            /**
             * Sets the value of the field, delegating conversion and validation to the field.
             * @param value The value to set.
             */
            set(this: Model, value: TInternal | TExternal | null): void {
                // call the get method when the new value is empty, to allow for validations / default values
                this.$data[key] = value == null ? field.get(key) : field.set(key, value);
            },
            enumerable: true,
            configurable: false,
        })));
    }

    /**
     * Populates this model with all the given properties. Non-existent fields are ignored.
     * @param properties The properties to set.
     * @return this.
     */
    populate(properties: ModelProperties = {}): this {
        forEachObject(properties, (value, key) =>
            this.$fields[key] && (this[key] = value)
        );
        return this;
    }

    /**
     * Validates the schema. Override this method to add extra validations.
     * @return this.
     */
    validate(): this {
        forEachObject(this.$fields, (field, key) => this[key] = this[key]);
        return this;
    }

    /**
     * Validates the schema and serializes it to the output format.
     * @return The serialized properties.
     */
    serialize(): ModelProperties {
        this.validate();
        return mapObject(this.$fields, (field: Field<any>, key: string) => {
            const value = this[key];
            return value == null ? null : field.serialize(key, value);
        });
    }
}
