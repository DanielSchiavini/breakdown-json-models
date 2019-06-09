import {ValidationError, invalidEnumValue, fieldRequired, invalidType} from './errors/validation-errors';
import EmbeddedField from './fields/embedded-field';
import EnumField from './fields/enum-field';
import ListField from './fields/list-field';
import StringField from './fields/string-field';
import Field from './fields/field';
import Model, {ModelProperties, ModelConstructor} from './schema/model';
import property from './fields/property';

const fields = {EmbeddedField, EnumField, ListField, StringField, Field};
const validation = {ValidationError, invalidEnumValue, fieldRequired, invalidType};

export default Model;
export {
    validation,
    fields,
    property,
    Model,
    ModelProperties,
    ModelConstructor
};
