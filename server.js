var http = require('http');
var controller = require('./lib/controller');
var server = http.createServer(controller);
server.listen(3000);
console.log("server listening on 3000");

