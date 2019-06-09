import Model, {ModelProperties} from './model';
import StringField from '../fields/string-field';
import EnumField from '../fields/enum-field';
import ListField from '../fields/list-field';
import {fieldRequired, invalidEnumValue, invalidType} from '../errors/validation-errors';
import EmbeddedField from '../fields/embedded-field';
import {makeJsonBody} from '../utils/json';
import property from '../fields/property';

enum ExampleEnum {
    ONE = 'one',
    TWO = 'two',
}

class TestModel extends Model {
    @property(StringField.create('The title').asRequired())
    public title: string;

    @property(ListField.of(StringField.create('Some strings')))
    public strings: string[];

    @property(ListField.of(EmbeddedField.of(TestModel, 'Some models')))
    public testModels: TestModel[];

    @property(EnumField.of(ExampleEnum, 'An enum'))
    public state: ExampleEnum = ExampleEnum.TWO;

    constructor(properties?: ModelProperties) {
        super();
        this.populate(properties);
    }
}

class AnotherTestModel extends Model {
    @property(ListField.of(EnumField.of(ExampleEnum, 'A list of enums')))
    public state: ExampleEnum;

    @property(StringField.create('A description field'))
    public description = 'default description';

    constructor(properties?: ModelProperties) {
        super();
        this.populate(properties);
    }
}

describe('Models', () => {
    it('should be initialized', () => {
        const properties = {
            title: 'Example',
            testModels: [],
            state: 'ONE',
        };
        const result = new TestModel();
        result.populate(properties);
        result.validate();
        expect(result.serialize()).toEqual(properties);
        expect(result.state).toEqual(ExampleEnum.ONE);
    });

    it('should create an empty instance', () => {
        const result = new AnotherTestModel();
        expect(result.serialize()).toEqual({description: 'default description'});
        expect(result.state).toEqual(null);
    });

    it('should allow values to be changed', () => {
        const result = new TestModel({title: 'testTitle'});
        result.state = ExampleEnum.ONE;
        result.strings = ['one', 'two'];
        expect(result.serialize()).toEqual({title: 'testTitle', state: 'ONE', strings: ['one', 'two']});
        expect(result.state).toEqual(ExampleEnum.ONE);
        expect(result.strings).toEqual(['one', 'two']);
    });

    it('should allow values to be retrieved', () => {
        const result = new TestModel({strings: ['one', 'two'], title: '123', state: ExampleEnum.TWO});
        expect(result.state).toEqual(ExampleEnum.TWO);
        expect(result.title).toEqual('123');
        expect(result.strings).toEqual(['one', 'two']);
        expect(result.serialize()).toEqual({strings: ['one', 'two'], title: '123', state: 'TWO'});
    });

    it('should allow for sub models', () => {
        const result = new TestModel({
            title: 'parent',
            testModels: [
                new TestModel({title: 'child 1'}),
                {title: 'child 2'},
            ],
        });
        expect(result.testModels.map(model => model.constructor)).toEqual([TestModel, TestModel]);
        expect(result.testModels.map(model => model.title)).toEqual(['child 1', 'child 2']);
        expect(result.serialize()).toEqual({
            title: 'parent', state: 'TWO',
            testModels: [{state: 'TWO', title: 'child 1'}, {state: 'TWO', title: 'child 2'}],
        });
    });

    it('should have the right keys', () => {
        expect(Object.keys(TestModel)).toEqual([]);
        expect(Object.keys(TestModel.prototype)).toEqual(['$fields']);

        const model = new TestModel();
        model.testModels = [];
        expect(Object.keys(model)).toEqual(['title', 'strings', 'testModels', 'state']);
        expect(Object.getOwnPropertyNames(model)).toEqual(['$data', 'title', 'strings', 'testModels', 'state']);

        expect(Object.keys(new AnotherTestModel())).toEqual(['state', 'description']);
    });

    it('should validate on creation', () => {
        expect(() => new TestModel({state: 'invalid'})).toThrow(invalidEnumValue('state', 'invalid'));
    });

    it('should check required fields on get', () => {
        expect(() => new TestModel().title).toThrow(fieldRequired('title'));
    });

    it('should check the value is a string', () => {
        expect(() => new TestModel({title: 2})).toThrow(invalidType('title', 0));
    });

    it('should check the value is a list', () => {
        expect(() => new TestModel({strings: 2})).toThrow(invalidType('strings', 0));
    });

    it('should check the value is an object', () => {
        const model = new TestModel({title: 'a'});
        expect(() => model.populate({testModels: [1]})).toThrow(invalidType('testModels[0]', 0));
    });

    it('validates on set', () => {
        const model = new TestModel();
        // @ts-ignore
        expect(() => model.state = 'invalid').toThrow(invalidEnumValue('state', 'invalid'));
        expect(() => model.title = null).toThrow(fieldRequired('title'));
    });

    it('converts to JSON properly', () => {
        expect(makeJsonBody(new TestModel({title: 'title'}))).toEqual('{\n' +
            '  "data": {\n' +
            '    "title": "title",\n' +
            '    "state": "TWO"\n' +
            '  }\n' +
            '}');
    });

    it('converts as array to JSON properly', () => {
        expect(makeJsonBody([new TestModel({title: 'title'})])).toEqual('{\n' +
            '  "data": [\n' +
            '    {\n' +
            '      "title": "title",\n' +
            '      "state": "TWO"\n' +
            '    }\n' +
            '  ]\n' +
            '}');
    });
});
