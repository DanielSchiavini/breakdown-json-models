import {Field} from '..';
import Model from "../schema/model";

/**
 * Decorates a model property, making it delegate get and set methods to a
 * @param field: The field instance that specifies how the property should be validated.
 * @typeparam TExternal The type of the field when serialized.
 * @typeparam TInternal The type of the field in the application.
 * @return The decorator.
 */
export default <TExternal, TInternal>(field: Field<TExternal, TInternal>) =>
    /**
     * Function that decorates the property. It gets called only once with the static model.
     * @param target The model constructor.
     * @typeparam TModel The type of the model where the field si being added.
     * @typeparam TKey The name of the field.
     * @param key The key of the property.
     */
    <TModel extends {}, TKey extends keyof TModel>
    (target: Model & Record<TKey, TInternal>, key: TKey): void => {
        target.addField(key as string, field);
    };
