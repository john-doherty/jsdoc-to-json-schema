var string2stream = require('string-to-stream'),
    stream2string = require('stream-to-string'),
    fs = require('fs-extra-promise'),
    jsDocParse = require("jsdoc-parse")();

module.exports = function(input, output){
    
    input = input || process.stdin;     // default stdin
    output = output || process.stdout;  // default stdout
    
    // get input as a stream
    getInputAsStream(input).then(function(inputStream){
        
        // send input into jsdoc-parser
        inputStream.pipe(jsDocParse);
        
        // read jsdoc-parse output as json string
        stream2string(jsDocParse).then(function(comments){
            
            // convert json string into JSON array of comments
            var jsonComments = JSON.parse(comments);
            
            // build json schema from comments
            var jsonSchema = buildJsonSchema(jsonComments);
            
            // if the output is a stream
            if (output.write){
                
                // send result to output stream
                string2stream(JSON.stringify(jsonSchema)).pipe(output);
            }
            else {

                // otherwise, write output to disk        
                fs.writeJsonAsync(output, jsonSchema, {spaces: 4}).then(function(err){
                    if (err){
                        console.error(err);
                    }
                });
            }
            
        });
    });
    
};

function getInputAsStream(input){
    
    return new Promise(function(resolve, reject){
        
        if (input.write){
            
            // already a stream
            resolve(input);
        }
        else {
            
            // read from file
            fs.readFileAsync(input, 'utf-8').then(function(data){
                
                // convert file string into stream and pipe into jsdoc-parse
                var stream = string2stream(data);
                
                // return stream
                resolve(stream);

            })
            .catch(function(err){
                reject(err);
            });
        }
        
    });
}


/**
 * Builds a JSON v3 schema based on schema tags found
 * @comments {array} - array of jsdoc comment blocks with scope information
 */
function buildJsonSchema(comments){
    
    // skeleton schema object
    var schema = {
        properties: {
        }
    };
    
    // go through each comment block
    (comments||[]).forEach(function(block){
        
        // we're only interested in customTags (none standard jsDoc comments i.e. @schema.)
        (block.customTags||[]).forEach(function(item){
            
            var tag = item.tag.replace('schema.',''),
                value = item.value || '';
            
            if (block.scope === 'global'){
                schema[tag] = value;
            }
            else{
                
                // item is a property
                schema.properties[block.name] = schema.properties[block.name] || {};

                // jsdoc-parse lowercases tag names, so we need more case blocks to correct this
                switch (tag){
                    
                    /* integers */
                    
                    case 'minimum':
                    case 'maximum': {
                        schema.properties[block.name][tag] = parseInt(value);
                    } break;
                    
                    case 'minitems':{
                        schema.properties[block.name]['minItems'] = parseInt(value);
                    } break;
                    
                    case 'maxitems':{
                        schema.properties[block.name]['maxItems'] = parseInt(value);
                    } break;
                    
                    case 'minlength':{
                        schema.properties[block.name]['minLength'] = parseInt(value);
                    } break;
                    
                    case 'maxlength':{
                        schema.properties[block.name]['maxLength'] = parseInt(value);
                    } break;
                    
                    case 'exclusiveminimum':{
                        schema.properties[block.name]['exclusiveMinimum'] = parseInt(value);
                    } break;
                    
                    case 'exclusivemaximum':{
                        schema.properties[block.name]['exclusiveMaximum'] = parseInt(value);
                    } break;
                    
                    case 'divisibleby': {
                        schema.properties[block.name]['divisibleBy'] = parseInt(value);
                    } break;
                    
                    /* booleans */
                    
                    case 'required': {
                        schema.properties[block.name][tag] = (value === 'true');
                    } break;
                    
                    case 'uniqueitems': {
                        schema.properties[block.name]['uniqueItems'] = (value === 'true');
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
};
