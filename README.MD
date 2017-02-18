# jsdoc-to-json-schema

[![npm](https://img.shields.io/npm/dt/jsdoc-to-json-schema.svg)](https://www.npmjs.com/package/jsdoc-to-json-schema) [![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

Generate JSON schemas from JavaScript comments using a new jsDoc *@schema* tag.

## Installation

```js
npm install --save jsdoc-to-json-schema
```

## Example

Using jsdoc-to-json-schema as a node module:

```js
var toJsonSchema = require('jsdoc-to-json-schema');

// generate a JSON schema for product.js
toJsonSchema('./example/product.js', './example/product.schema.json');
```

Using jsdoc-to-json-schema via the command line:

```
$ jsdoc-to-json-schema -i ./example/product.js -o ./example/product.schema.json
```

as an express response

```js
var app = require('express')(),
    toJsonSchema = require('../lib/jsdoc-to-json-schema.js');

app.get('/', function(req, res){

    // return JSON schema generated from person.js script comments
    toJsonSchema('./examples/person.js', res);
});

app.listen(8080, function(){
    console.log('Example app listening on port 8080');
});
```

For use with express consider the dedicated express middleware project [express-json-schema](https://github.com/john-doherty/express-json-schema)

### Input *(singleton)*

JavaScript file containing jsDoc *@schema* tags used to specify the JSON schema output.

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

JavaScript file containing jsDoc *@schema* tags used to specify the JSON schema output.

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


## TODO

 1. Add unit tests
 2. Add options (i.e. strict mode, ignoring none schema defined tags)
 3. Add glob support

## License

Licensed under [ISC License](LICENSE) &copy; [John Doherty](http://www.johndoherty.info)
