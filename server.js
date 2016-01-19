var http = require('http');
var controller = require('./lib/controller');
var server = http.createServer(controller);
server.listen(process.env.OPENSHIFT_NODEJS_PORT||process.env.PORT||5000||process.env.OPENSHIFT_NODEJS_IP);
console.log("server started");
