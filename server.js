var http = require('http');
var controller = require('./lib/controller');
var server = http.createServer(controller);
server.listen(process.env.PORT||5000);
console.log("server started");
