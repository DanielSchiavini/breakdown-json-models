import {parseModel} from './json';
import {StoryRequest} from '../board/story-request';
import {dataFieldRequired, jsonBodyRequired} from '../errors/http-errors';

describe('JSON utilities', () => {
    it('requires a data field', () => {
        expect(() => parseModel('{"title": "title"}', StoryRequest)).toThrow(dataFieldRequired());
    });

    it('requires a data field', () => {
        expect(() => parseModel('...', StoryRequest)).toThrow(jsonBodyRequired());
    });
});
