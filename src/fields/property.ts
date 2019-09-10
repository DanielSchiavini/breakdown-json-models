import {Field} from '..';

/**
 * Decorates a model property, making it delegate get and set methods to a
 * @param field: The field instance that specifies how the property should be validated.
 * @typeparam TExternal The type of the field when serialized.
 * @typeparam TInternal The type of the field in the application.
 * @return The decorator.
 */
export default <TExternal, TInternal>(field: Field<TExternal, TInternal>): any =>
    /**
     * Function that decorates the property. It gets called only once with the static model.
     * @param target The model constructor.
     * @param key The key of the property.
     */
    (target: any, key: string): void => {
        target.addField(key, field);
    };
