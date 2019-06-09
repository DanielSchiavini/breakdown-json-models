import {dataFieldRequired, jsonBodyRequired, methodNotAllowed, pageNotFound, serverError} from './http-errors';
import {makeJsonError, tryParseJson} from '../utils/json';

describe('HTTP errors', () => {
    it('should give correct http code', () => {
        expect(pageNotFound('url').httpStatus).toEqual(404);
    });

    it('should create pageNotFound', () => {
        expect(tryParseJson(makeJsonError(pageNotFound('url')))).toEqual({
            errors: [{
                code: 'pageNotFound',
                meta: [{url: 'url'}],
                status: 404,
                title: 'The requested page could not be found.',
            }]
        });
    });

    it('should create methodNotAllowed', () => {
        expect(tryParseJson(makeJsonError(methodNotAllowed('url', 'get')))).toEqual({
            errors: [{
                code: 'methodNotAllowed',
                meta: [{url: 'url', method: 'get'}],
                status: 405,
                title: 'The requested method is not allowed.',
            }]
        });
    });

    it('should create jsonBodyRequired', () => {
        expect(tryParseJson(makeJsonError(jsonBodyRequired()))).toEqual({
            errors: [{
                code: 'jsonBodyRequired',
                meta: [],
                status: 422,
                title: 'A JSON entity is expected in the responseBody of the request.',
            }]
        });
    });

    it('should create dataFieldRequired', () => {
        expect(tryParseJson(makeJsonError(dataFieldRequired()))).toEqual({
            errors: [{
                code: 'dataFieldRequired',
                meta: [],
                status: 422,
                title: 'A JSON entity is expected in the data field.',
            }]
        });
    });

    it('should create serverError', () => {
        expect(tryParseJson(makeJsonError(serverError()))).toEqual({
            errors: [{
                code: 'serverError',
                meta: [],
                status: 500,
                title: 'The server encountered an unexpected situation, our team has been informed.',
            }]
        });
    });
 });
