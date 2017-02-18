 if (module.parent){
    module.exports = require('./lib/jsdoc-to-json-schema.js');
}
else {

    var program = require('commander'),
        pjson = require('./package.json');

    program.version(pjson.version)
        .option('-i, --input <string>', 'path to input file or folder')
        .option('-o, --output <string>', 'path to output file or folder')
        .parse(process.argv);
    
    module.exports = new require('./lib/jsdoc-to-json-schema.js')(program.input, program.output);    
}