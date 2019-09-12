/**
 * A type for an object with string keys and a given type of values.
 */
export interface Mapping<T> {
    [key: string]: T;
}

/**
 * Runs the given function to each item in the object.
 * @param obj The object to iterate through.
 * @param fn The function to call.
 */
export function forEachObject<TObj, TIn, TOut, TKey extends keyof TObj>(
    obj: Record<TKey, TIn>, fn: (value: TIn, key: TKey) => any
): void {
    Object.keys(obj).forEach(key => fn(obj[key], key as TKey));
}

/**
 * Creates a new object with the results of calling the given function for each item.
 * If the function returns null or undefined, the resulting object will not have that key.
 * @param obj The object to iterate through.
 * @param fn The function to call.
 * @return An object with the results of the function calls.
 */
export function mapObject<TObj extends {}, TIn, TOut, TKey extends keyof TObj>(
    obj: Record<TKey, TIn>, fn: (value: TIn, key: TKey) => TOut | null
): Record<TKey, TOut> {
    const result: any = {};
    forEachObject(obj, (oldValue, key) => {
        const newValue = fn(oldValue, key);
        if (newValue != null) {
            result[key] = newValue;
        }
    });
    return result;
}

/**
 * Creates a new object with the results of calling the given function for each item.
 * This is similar to {@link mapObject} but it allows for new keys in the resulting object.
 * @param obj The object to iterate through.
 * @param fn The function to call. It should return a tuple with the new key and new value.
 * @typeparam TObjIn The type of the @param obj.
 * @typeparam TIn The the type of the properties for which the @param fn will be applied.
 * @typeparam TOut The type of the output of the @param fn.
 * @typeparam TKeyIn The keys of @typeparam TObjIn
 * @typeparam TKeyOut The keys of the output.
 * @return An object with the results of the function calls.
 */
export function transformObject<
    TObjIn extends {}, TIn, TOut, TKeyIn extends keyof TObjIn, TKeyOut extends string|number|symbol
>(
    obj: Record<TKeyIn, TIn>, fn: (value: TIn, key: TKeyIn) => [TKeyOut, TOut]
): Record<TKeyOut, TOut> {
    const result: any = {};
    forEachObject(obj, (value, key) => {
        const [newKey, newValue] = fn(value, key);
        result[newKey] = newValue;
   });
    return result;
}
