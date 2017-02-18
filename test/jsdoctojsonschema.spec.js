'use strict';

var toJsonSchema = require('../index.js');
var path = require('path');

describe('jsdoc-to-json-schema', function () {

    it('should be defined', function () {
        expect(toJsonSchema).toBeDefined();
    });

    it('should return JSON Schema for JS singleton', function (done) {

        var inputFile = path.resolve('./test/data/test-singleton.js');

        // generate a JSON schema for product.js
        toJsonSchema(inputFile).then(function(schema){

            expect(schema).toBeDefined();

            // top level
            expect(schema.name).toEqual('product');
            expect(schema.description).toEqual('An e-commerce product');
            expect(schema.properties).toBeDefined();

            // .name property
            expect(schema.properties.name).toBeDefined();
            expect(schema.properties.name.type).toEqual('string');
            expect(schema.properties.name.title).toEqual('Name');
            expect(schema.properties.name.description).toEqual('The SEO friendly name of the product');
            expect(schema.properties.name.minLength).toEqual(3);
            expect(schema.properties.name.maxLength).toEqual(255);
            expect(schema.properties.name.required).toEqual(true);

            // .url property
            expect(schema.properties.url).toBeDefined();
            expect(schema.properties.url.type).toEqual('string');
            expect(schema.properties.url.title).toEqual('Url');
            expect(schema.properties.url.description).toEqual('Unique, SEO friendly product Url');
            expect(schema.properties.url.minLength).toEqual(1);
            expect(schema.properties.url.maxLength).toEqual(255);
            expect(schema.properties.url.required).toEqual(true);

            // .price property
            expect(schema.properties.price).toBeDefined();
            expect(schema.properties.price.type).toEqual('number');
            expect(schema.properties.price.title).toEqual('Price');
            expect(schema.properties.price.description).toEqual('Price of the product');
            expect(schema.properties.price.minimum).toEqual(0);
            expect(schema.properties.price.required).toEqual(true);

            done();
        })
        .catch(function(err){
            done(err);
        });
    });

});