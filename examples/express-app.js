var app = require('express')(),
    toJsonSchema = require('../lib/jsdoc-to-json-schema.js');

// request this route to get a JSON schema from person.js
app.get('/', function(req, res){
    toJsonSchema('./examples/person.js', res);
});
    
app.listen(8080, function(){
    console.log('Example app listening on port 8080');
});