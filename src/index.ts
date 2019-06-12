import {ValidationError, invalidEnumValue, fieldRequired, invalidType} from './errors/validation-errors';
import Model, {ModelProperties, ModelConstructor} from './schema/model';
import property from './fields/property';
import EmbeddedField from './fields/embedded-field';
import EnumField from './fields/enum-field';
import ListField from './fields/list-field';
import StringField from './fields/string-field';
import Field from './fields/field';
import ObjectField from './fields/object-field';
import UnionField from './fields/union-field';
import NumberField from './fields/number-field';

const fields = {EmbeddedField, EnumField, ListField, StringField, UnionField, NumberField, ObjectField, Field};
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
