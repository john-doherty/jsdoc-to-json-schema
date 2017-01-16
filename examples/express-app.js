var app = require('express')(),
    toJsonSchema = require('../lib/jsdoc-to-json-schema.js');

app.get('/', function(req, res){
    
    // return JSON schema generated from person.js script comments
    toJsonSchema('./examples/person.js', res);
});
    
app.listen(8080, function(){
    console.log('Example app listening on port 8080');
});