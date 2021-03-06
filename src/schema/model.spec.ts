import {
    Model, property, EnumField, ObjectField, NumberField, UnionField, EmbeddedField, ListField, StringField,
    UrlField, DateField, invalidType, fieldRequired, invalidEnumValue, invalidFormat
} from '..';

enum ExampleEnum {
    ONE = 'one',
    TWO = 'two',
}

class TestModel extends Model {
    @property(StringField.create('The title').withRegex(/[\w ]+/).asRequired())
    public title: string;

    @property(ListField.of(StringField.create('Some strings')))
    public strings: string[];

    @property(UnionField.of(NumberField.create('A number'), ObjectField.create('An object')))
    public either: object | number;

    @property(ListField.of(EmbeddedField.of(TestModel, 'Some models')))
    public testModels: TestModel[];

    @property(EnumField.of(ExampleEnum, 'An enum'))
    public state: ExampleEnum = ExampleEnum.TWO;

    @property(DateField.create('A date'))
    public date?: Date;

    @property(UrlField.create('An url'))
    public url?: string;

    constructor(properties?) {
        super();
        this.populate(properties);
    }
}

class AnotherTestModel extends Model {
    @property(ListField.of(EnumField.of(ExampleEnum, 'A list of enums')))
    public state: ExampleEnum[];

    @property(StringField.create('A description field'))
    public description = 'default description';

    constructor(properties?) {
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
        expect(Object.keys(model)).toEqual(['title', 'strings', 'either', 'testModels', 'state', 'date', 'url']);
        expect(Object.getOwnPropertyNames(model)).toEqual([
            '$data', 'title', 'strings', 'either', 'testModels', 'state', 'date', 'url'
        ]);
        expect(Object.keys(new AnotherTestModel())).toEqual(['state', 'description']);
    });

    it('should accept values on the first type of the either field', () => {
        const model = new TestModel({title: 'model with an object', url: 'http://localhost.local',
            date: '2019-01-30T01:01:02.123Z'});
        model.either = {an: 'object'};
        expect(model.serialize()).toEqual({
            either: {an: 'object'},
            title: 'model with an object',
            state: 'TWO',
            date: new Date(Date.UTC(2019, 0, 30, 1, 1, 2, 123)),
            url: 'http://localhost.local',
        });
    });

    it('should accept values on the second type of the either field', () => {
        const model = new TestModel({title: 'model with an object'});
        model.either = 2;
        expect(model.serialize()).toEqual({either: 2, title: 'model with an object', state: 'TWO'});
    });

    it('should not accept values that are neither of the valid types', () => {
        expect(() => new TestModel({either: 'invalid'})).toThrow(invalidType('either', 'invalid'));
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

    it('should check the string is a valid date', () => {
        const model = new TestModel({title: 'a'});
        expect(() => model.populate({date: 'x'})).toThrow(invalidFormat('date', 'x', 'ISO 8601'));
    });

    it('should check the value is a date object', () => {
        const model = new TestModel({title: 'a'});
        expect(() => model.populate({date: []})).toThrow(invalidType('date', []));
    });

    it('should check the value is a valid URL', () => {
        const model = new TestModel({title: 'a'});
        expect(() => model.populate({url: '2019'})).toThrow(invalidFormat('url', '2019', UrlField.REGEX.toString()));
    });

    it('validates on set', () => {
        const model = new TestModel();
        // @ts-ignore
        expect(() => model.state = 'invalid').toThrow(invalidEnumValue('state', 'invalid'));
        expect(() => model.title = null).toThrow(fieldRequired('title'));
    });

    it('converts to JSON properly', () => {
        expect(JSON.stringify({data: new TestModel({title: 'title'}).serialize()}, null, 2)).toEqual('{\n' +
            '  "data": {\n' +
            '    "title": "title",\n' +
            '    "state": "TWO"\n' +
            '  }\n' +
            '}');
    });

    it('converts as array to JSON properly', () => {
        expect(JSON.stringify({data: [new TestModel({title: 'title'}).serialize()]}, null, 2)).toEqual('{\n' +
            '  "data": [\n' +
            '    {\n' +
            '      "title": "title",\n' +
            '      "state": "TWO"\n' +
            '    }\n' +
            '  ]\n' +
            '}');
    });
});
