# jsdoc-to-json-schema

Generate JSON Schema from JavaScript/JSON objects using JSDoc style comments.

***NOTE:*** Early release, tests and documentation will be added shortly. Feel free to contribute/rise bugs.

## Installation

```js
npm install jsdoc-to-json-schema --save
```

## Input *(singleton)*

JavaScript or JSON file containing **@schema.** tags used to represent the desired JSON schema.

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

## Output

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

## Input *(Instance)*
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

## Output

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

## Usage

As a node.js module

```js
var jsDocToJsonSchema = require('jsdoc-to-json-schema');

jsDocToJsonSchema('./example/product.js', './example/product.schema.json');
```

Via the command line

```
$ jsdoc-to-json-schema -i ./example/product.js -o ./example/product.schema.json
```

## Supported JSON Schema tags

The following JSON Schema v3 tags are supported

### @schema.name

TODO: Add content


### @schema.extends

TODO: Add content


### @schema.id

TODO: Add content


### @schema.type

TODO: Add content


### @schema.pattern

TODO: Add content


### @schema.title

TODO: Add content


### @schema.format

TODO: Add content


### @schema.disallow

TODO: Add content


### @schema.extends

TODO: Add content


### @schema.enum

TODO: Add content


### @schema.description

TODO: Add content


### @schema.name

TODO: Add content


### @schema.minimum

TODO: Add content


### @schema.maximum

TODO: Add content


### @schema.minItems

TODO: Add content


### @schema.maxItems

TODO: Add content


### @schema.minLength

TODO: Add content


### @schema.maxLength

TODO: Add content


### @schema.exclusiveMinimum

TODO: Add content


### @schema.exclusiveMaximum

TODO: Add content


### @schema.divisibleBy

TODO: Add content


### @schema.required

TODO: Add content


### @schema.uniqueItems

TODO: Add content


### @schema.default

TODO: Add content


## Outstanding tasks

 * Add options (i.e. strict mode, allowing only schema v3 tags)
 * Add glob support
 * Add unit tests
 * Add pipe support

## License

[ISC License](LICENSE) &copy; 2016 [John Doherty](http://wwww.johndoherty.info/)