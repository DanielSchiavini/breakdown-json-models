/**
 * This is the base error class for any error that may be raised by our API.
 */
export default class ResponseError extends Error {
    /**
     * Other metadata specific for the error.
     */
    private readonly meta: any[];

    /**
     * Creates a new response error.
     * @param status The HTTP status code, e.g. 400/500.
     * @param code The error code, e.g. 'pageNotFound'.
     * @param title A translatable error message.
     * @param meta Other metadata that depends on the error code.
     */
    constructor(private readonly status: number, private readonly code: string, private readonly title: string, ...meta: any[]) {
        super(`Error ${code}: ${title} ` + JSON.stringify({meta}));
        this.meta = meta;
    }
}
