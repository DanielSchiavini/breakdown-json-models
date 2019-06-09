import ResponseError from './response-error';

/**
 * Class that represents errors in the HTML protocol.
 */
export class HttpError extends ResponseError {}

export const pageNotFound = (url: string) =>
    new HttpError(404, 'pageNotFound', 'The requested page could not be found.', {url});

export const methodNotAllowed = (url: string, method: string) =>
    new HttpError(405, 'methodNotAllowed', 'The requested method is not allowed.', {url, method});

export const jsonBodyRequired = () =>
    new HttpError(422, 'jsonBodyRequired', 'A JSON entity is expected in the responseBody of the request.');

export const dataFieldRequired = () =>
    new HttpError(422, 'dataFieldRequired', 'A JSON entity is expected in the data field.');

export const serverError = () =>
    new HttpError(500, 'serverError', 'The server encountered an unexpected situation, our team has been informed.');
