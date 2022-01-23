var string2stream = require('string-to-stream');
var fs = require('fs-extra-promise');
var jsdoc2md = require('jsdoc-to-markdown');

module.exports = function(input, output) {

    input = input || process.stdin;     // default stdin
    output = output || process.stdout;  // default stdout

    return jsdoc2md.getTemplateData({ files: input, 'no-cache': true }).then((comments) => {

        // build json schema from comments
        var jsonSchema = buildJsonSchema(comments);

        // if the output is a stream
        if (output.write) {

            // send result to output stream
            string2stream(JSON.stringify(jsonSchema)).pipe(output);
        }
        else {

            // otherwise, write output to disk
            fs.writeJsonAsync(output, jsonSchema, { spaces: 4 }).then(function(err) {
                if (err) {
                    console.error(err);
                }
            });
        }

        // if no output object, return promise with JSON object
        return Promise.resolve(jsonSchema);

    });
};

/**
 * Returns a file as a stream
 * @param {string} input - path to json/js file containing JSDoc comments
 * @returns {Promise} promise to return a stream if the file exists
 */
function getInputAsStream(input) {

    return new Promise(function(resolve, reject) {

        if (input.write) {

            // already a stream
            resolve(input);
        }
        else {

            // read from file
            fs.readFileAsync(input, 'utf-8').then(function(data) {

                // convert file string into stream and pipe into jsdoc-parse
                var stream = string2stream(data);

                // return stream
                resolve(stream);

            })
            .catch(function(err) {
                reject(err);
            });
        }

    });
}

/**
 * Builds a JSON v3 schema based on schema tags found
 * @param {array} comments - array of jsdoc comment blocks with scope information
 * @returns {object} JSON Schema object
 */
function buildJsonSchema(comments) {

    // skeleton schema object
    var schema = {
        properties: {
        }
    };

    // go through each comment block
    (comments || []).forEach(function(block) {

        // we're only interested in customTags (none standard jsDoc comments i.e. @schema.)
        (block.customTags || []).forEach(function(item) {

            var tag = item.tag.replace('schema.', '');
            var value = item.value || '';

            // skip properties with no value
            if (value === '') return;

            if (block.scope === 'global') {
                schema[tag] = value;
            }
            else {

                // item is a property
                schema.properties[block.name] = schema.properties[block.name] || {};

                // jsdoc-parse lowercase tag names, so we need more case blocks to correct this
                switch (tag) {

                    /* integers */

                    case 'minimum':
                    case 'maximum': {
                        schema.properties[block.name][tag] = parseInt(value, 10);
                    } break;

                    case 'minitems': {
                        schema.properties[block.name].minItems = parseInt(value, 10);
                    } break;

                    case 'maxitems': {
                        schema.properties[block.name].maxItems = parseInt(value, 10);
                    } break;

                    case 'minlength': {
                        schema.properties[block.name].minLength = parseInt(value, 10);
                    } break;

                    case 'maxlength': {
                        schema.properties[block.name].maxLength = parseInt(value, 10);
                    } break;

                    case 'exclusiveminimum': {
                        schema.properties[block.name].exclusiveMinimum = parseInt(value, 10);
                    } break;

                    case 'exclusivemaximum': {
                        schema.properties[block.name].exclusiveMaximum = parseInt(value, 10);
                    } break;

                    case 'divisibleby': {
                        schema.properties[block.name].divisibleBy = parseInt(value, 10);
                    } break;

                    /* boolean's */

                    case 'required': {
                        schema.properties[block.name][tag] = (value === 'true');
                    } break;

                    case 'uniqueitems': {
                        schema.properties[block.name].uniqueItems = (value === 'true');
                    } break;

                    /* strings */

                    case 'extends':
                    case 'id':
                    case 'type':
                    case 'pattern':
                    case 'title':
                    case 'format':
                    case 'disallow':
                    case 'extends':
                    case 'enum':
                    case 'description':
                    case 'name':
                    case 'default':
                    default: {
                        schema.properties[block.name][tag] = value;
                    } break;
                }
            }

        });
    });

    return schema;
}

/* --- HELPER METHODS -- */

/**
 * Deep sets a property on an object
 * @param {object} obj to modify
 * @param {string} propString property to add (can contain . notation for child elements)
 * @param {any} value to assign
 * @returns {object} modified object
 */
function setPropertyByPath(obj, propString, value) {

    var propNames = propString.split('.');
    var propLength = propNames.length - 1;
    var tmpObj = obj;

    for (var i = 0; i <= propLength; i++) {
        tmpObj = tmpObj[propNames[i]] = i !== propLength ? {} : value;
    }
    return obj;
}
