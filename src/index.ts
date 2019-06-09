import * as validation from "./errors/validation-errors";
import EmbeddedField from "./fields/embedded-field";
import EnumField from "./fields/enum-field";
import ListField from "./fields/list-field";
import StringField from "./fields/string-field";
import Field from "./fields/field";
import Model, {ModelProperties} from "./schema/model";
import property from "./fields/property";

const fields = {
    EmbeddedField,
    EnumField,
    ListField,
    StringField,
    Field,
};

type Properties = ModelProperties;

export default Model;
export {
    validation,
    fields,
    property,
    Model,
    Properties,
};
