# jsdoc-to-json-schema

[![Shippable branch](https://img.shields.io/shippable/5818b23cd68ac10e0020bf2b/master.svg)](https://app.shippable.com/projects/5818b23cd68ac10e0020bf2b) [![npm](https://img.shields.io/npm/dt/jsdoc-to-json-schema.svg)](https://www.npmjs.com/package/jsdoc-to-json-schema)

Generate JSON schemas from JavaScript code comments using a new jsDoc [@schema](#input-singleton) tag.

## Installation

```js
npm install --save jsdoc-to-json-schema
```

## Example

### Using this module within your node project

```js
var toJsonSchema = require('jsdoc-to-json-schema');

// OPTION 1: generate a JSON schema for product.js and save it to disk
toJsonSchema('./example/product.js', './example/product.schema.json');

// OPTION 2: generate a JSON schema and return it as an object
toJsonSchema('./example/product.js').then(function(schema){
    // do something with it
});

// OPTION 3: generate a JSON schema, save it to disk and return it as an object
toJsonSchema('./example/product.js', './example/product.schema.json').then(function(schema){
    // do something with it
});
```

### Using this module via the command line

```bash
# install the module globally
$ npm install -g jsdoc-to-json-schema

# execute from command line passing input and output paths
$ jsdoc-to-json-schema -i ./example/product.js -o ./example/product.schema.json
```

### Using this module as an expressjs response

```js
var express = require('express');
var app = express();
var toJsonSchema = require('../lib/jsdoc-to-json-schema.js');

// create an express route
app.get('/', function(req, res){

    // pipe schema directly to the response stream
    toJsonSchema('./examples/person.js', res);
});

// start the server listening on port 8080
app.listen(8080, function(){
    console.log('Example app listening on port 8080');
});
```

For use with express consider the dedicated express middleware project [express-json-schema](https://github.com/john-doherty/express-json-schema)

### Input *(singleton)*

JavaScript file containing jsDoc @schema tags used to define the JSON schema:

```js
/**
 * @schema.name Person
 * @schema.description This is an example Person object marked up with JSON schema tags to allow schema generation
 */
var Person = {

    /**
     * @schema.title Name
     * @schema.description Please enter your full name
     * @schema.type string
     * @schema.maxLength 30
     * @schema.minLength 1
     * @schema.required true
     */
    name: '',

    /**
     * @schema.title Job Title
     * @schema.type string
     */
    jobTitle: '',

    /**
     * @schema.title Telephone Number
     * @schema.description Please enter telephone number including country code
     * @schema.type string
     * @schema.required true
     */
    telephone: '',

    /**
     * @schema.type string
     * @schema.required true
     */
    dateOfBirth: ''
};
```

### Output

```js
{
    "name": "Person",
    "description": "This is an example Person object marked up with JSON schema tags to allow schema generation",
    "properties": {
        "name": {
            "title": "Name",
            "description": "Please enter your full name",
            "type": "string",
            "maxLength": 30,
            "minLength": 1,
            "required": true
        },
        "jobTitle": {
            "title": "Job Title",
            "type": "string"
        },
        "telephone": {
            "title": "Telephone Number",
            "description": "Please enter telephone number including country code",
            "type": "string",
            "required": true
        },
        "dateOfBirth": {
            "type": "string",
            "required": true
        },
        "address": {
            "type": "object"
        }
    }
}
```

### Input *(instance)*

JavaScript file containing jsDoc @schema tags used to define the JSON schema:

```js
/**
 * @schema.name Product
 * @schema.description An example product marked up with json schema comments
 */
function Product(){

}

/**
 * @schema.type array
 * @schema.minItems 3
 * @schema.maxItems 6
 * @schema.required true
 */
Product.prototype.types = function(){

}
```

### Output

```js
{
    "name": "Product",
    "description": "An example product marked up with json schema comments",
    "properties": {
        "types": {
            "type": "array",
            "minItems": 3,
            "maxItems": 6,
            "required": true
        }
    }
}
```



## Supported JSON Schema tags

The following [JSON Schema v3](https://tools.ietf.org/html/draft-zyp-json-schema-03) tags are supported, however undocumented *@schema* tags will also be generated in order to aid extensibility.

**Note:** @schema tags without an associated value will be ignored.

| Tag                        | Type
| -------------------------- | ---------
| `@schema.name`             | string
| `@schema.description`      | string
| `@schema.extends`          | string
| `@schema.id`               | string
| `@schema.type`             | string
| `@schema.pattern`          | string
| `@schema.title`            | string
| `@schema.format`           | string
| `@schema.disallow`         | string
| `@schema.enum`             | array
| `@schema.minimum`          | integer
| `@schema.maximum`          | integer
| `@schema.minItems`         | integer
| `@schema.maxItems`         | integer
| `@schema.minLength`        | integer
| `@schema.maxLength`        | integer
| `@schema.exclusiveMinimum` | integer
| `@schema.exclusiveMaximum` | integer
| `@schema.divisibleBy`      | integer
| `@schema.required`         | boolean
| `@schema.uniqueItems`      | boolean
| `@schema.default`          | any

## Running tests

Install dev dependencies and run tests:

```
$ npm install -d && npm test
```

## License

Licensed under [ISC License](LICENSE) &copy; [John Doherty](https://twitter.com/mrJohnDoherty)
