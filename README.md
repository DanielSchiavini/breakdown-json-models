BreakDown Models
======

This is the shared library that contains the models shared by the BreakDown apps.

## Running tests
To run all tests you may simply run `npm test`.
This also includes linting and test coverage checks.
To run a specific test you may run `node_modules/mocha --require ts-node/register --exit`.
Make sure to configure your IDE to pass these options along.

# Docker development
The docker image in this repository is not meant for deployment (it does not do anything).
However it is necessary to build the images of the other services.
To build the image, use:
```bash
docker build -t breakdown-model .
```

The tests run as part of the build.
To run the tests manually, execute:
```bash
docker run --rm --entrypoint npm breakdown-model test
```
