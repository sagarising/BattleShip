var http = require('http');
var controller = require('./lib/controller');
var server = http.createServer(controller);
server.listen(80);
console.log("server started");
