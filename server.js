var http = require('http');
var requestHandler = require('./lib/controller.js');
var server = http.createServer(requestHandler);
server.listen(3000);
console.log("server listening on 3000");

