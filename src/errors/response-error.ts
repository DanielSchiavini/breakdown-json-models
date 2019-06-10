/**
 * This is the base error class for any error that may be raised by our API.
 */
export default class ResponseError extends Error {
    /**
     * Other metadata specific for the error.
     */
    public readonly meta: any[];

    /**
     * Creates a new response error.
     * @param status The HTTP status code, e.g. 400/500.
     * @param code The error code, e.g. 'pageNotFound'.
     * @param title A translatable error message.
     * @param meta Other metadata that depends on the error code.
     */
    constructor(
        public readonly status: number,
        public readonly code: string,
        public readonly title: string,
        ...meta: any[]
    ) {
        super(`Error ${code}: ${title} ` + JSON.stringify({meta}));
        this.meta = meta;
    }
}
