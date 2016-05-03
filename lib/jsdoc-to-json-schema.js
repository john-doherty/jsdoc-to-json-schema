var path = require('path'),
    stream = require('stream'),
    fs = require('fs-extra-promise'), 
    jsDocParse = require("jsdoc-parse");

module.exports = function(input, output){
    
    // output to file or stdout 
    output = output || process.stdout;
    
    // read individual file
    fs.readFileAsync(input, 'utf-8').then(function(data){

        // create variable to store content
        var content = '';
        
        // grab a handle to the streamer
        var jsDocStreamer = jsDocParse();
        
        // create stream to pipe file data into parser (need to rework this)
        var readableStream = new stream.Readable();

        // write file data to jsDocParser
        readableStream.push(data);
        readableStream.push(null);
        readableStream.pipe(jsDocStreamer);
        
        // add each chunk to the content var so we can process once complete
        jsDocStreamer.on('data', function(chunk){
            content += chunk;
        });

        // once stream ends, attempt to build the JSON schema    
        jsDocStreamer.on('end', function(){
            
            if (content !== ''){
            
                // convert string into JSON array of comments
                var jsonComments = JSON.parse(content);
                
                // build json schem from comments
                var jsonSchema = buildJsonSchema(jsonComments);
                
                if (output.write){
                    // return as a stream
                    var s = new stream.Readable();
                    s._read = function noop() {};
                    s.push(JSON.stringify(jsonSchema));
                    s.push(null);
                    s.pipe(output);
                }
                else if (output!=='') {
                    fs.writeJsonAsync(output, jsonSchema, {spaces: 4}).then(function(err){
                        if (err){
                            console.error(err);
                        }
                    });
                }
            }
        });

    });
};

/**
 * Builds a JSON v3 schema based on schema tags found
 */
function buildJsonSchema(comments){
    
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
                    
                    /* property strings */
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
                    case 'name': {
                        schema.properties[block.name][tag] = value;
                    } break;
                    
                    /* property integers */
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
                    
                    case 'required': {
                        schema.properties[block.name][tag] = (value === 'true');
                    } break;
                    
                    case 'uniqueitems': {
                        schema.properties[block.name]['uniqueItems'] = (value === 'true');
                    } break;
                    
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