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
export function forEachObject<TIn, TOut>(obj: Mapping<TIn>, fn: (value: TIn, key: string) => any): void {
    Object.keys(obj).forEach(key => fn(obj[key], key));
}

/**
 * Creates a new object with the results of calling the given function for each item.
 * If the function returns null or undefined, the resulting object will not have that key.
 * @param obj The object to iterate through.
 * @param fn The function to call.
 * @return An object with the results of the function calls.
 */
export function mapObject<TIn, TOut>(obj: Mapping<TIn>, fn: (value: TIn, key: string) => TOut | null): Mapping<TOut> {
    const result = {};
    forEachObject(obj, (oldValue, key) => {
        const newValue = fn(oldValue, key);
        if (newValue != null) {
            result[key] = newValue;
        }
    });
    return result;
}

/**
 * Creates a new array with the results of calling the given function for each item in the object.
 * If the function returns null or undefined, it will not be included in the resulting array.
 * @param obj The object to iterate through.
 * @param fn The function to call.
 * @return An array with the results of the function calls.
 */
export function mapToArray<TIn, TOut>(obj: Mapping<TIn>, fn: (value: TIn, key: string) => TOut | null): TOut[] {
    const result = [];
    forEachObject(obj, (oldValue, key) => {
        const newValue = fn(oldValue, key);
        if (newValue != null) {
            result.push(newValue);
        }
    });
    return result;
}

/**
 * Creates a new object with the results of calling the given function for each item.
 * This is similar to {@link mapObject} but it allows for new keys in the resulting object.
 * @param obj The object to iterate through.
 * @param fn The function to call. It should return a tuple with the new key and new value.
 * @return An object with the results of the function calls.
 */
export function transformObject<TIn, TOut>(obj: Mapping<TIn>, fn: (value: TIn, key: string) => [string, TOut]): Mapping<TOut> {
    const result = {};
    forEachObject(obj, (value, key) => {
        const [newKey, newValue] = fn(value, key);
        result[newKey] = newValue;
   });
    return result;
}
