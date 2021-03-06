BreakDown Models
======

This is a TypeScript library that allows you to create strong-typed models for your application.
These models are able to validate themselves according to the rules you define.

Note that to achieve this we use the typescript [experimental decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
which may include breaking changes in future releases.

[![Build Status](https://travis-ci.com/DanielSchiavini/breakdown-json-models.svg?branch=master)](https://travis-ci.com/DanielSchiavini/breakdown-json-models)

We enforce 100% branch coverage in any code merged.

## Creating models
To create a new model, you must extend the `Model` class and add some fields to it.
For example:
```typescript
import ExampleEnum from 'example-enum';
import {Model, property, StringField, ListField, EnumField, EmbeddedField} from 'breakdown-json-models'

class TestModel extends Model {
    @property(StringField.create('The title').asRequired())
    public title: string;

    @property(ListField.of(StringField.create('Some strings')))
    public strings: string[];

    @property(ListField.of(EmbeddedField.of(TestModel, 'Some models')))
    public testModels: TestModel[];

    @property(EnumField.of(ExampleEnum, 'An enum'))
    public state: ExampleEnum = ExampleEnum.TWO;

    constructor(properties?) {
        super();
        this.populate(properties);
    }
}
```

You can then create instances of your model:
```typescript
// you can pass values in the constructor
const model = new TestModel({title: 'my title'});

// properties validated when set
model.strings = [1]; // throws ValidationError

// the validate and serialize methods make sure all required fields are set
model.validate();

// after model creation, you may use populate to change multiple values at one 
model.populate({state: ExampleEnum.ONE, testModels: []});

// to serialize your values to the wished output format, call serialize()
const jsonString = JSON.stringify(model.serialize());
console.log(jsonString);
```

## Running tests
To run all tests you may simply run `npm test`.
This also includes linting and test coverage checks.
To run a specific test you may run `node_modules/mocha --require ts-node/register --exit`.
Make sure to configure your IDE to pass these options along.
