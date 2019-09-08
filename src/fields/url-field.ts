import {StringField} from '..';

/**
 * A field containing a string that must be have the format of a valid URL.
 */
export default class UrlField extends StringField {
    static REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

    static create(description: string) {
        return new UrlField(description, this.REGEX);
    }
}
