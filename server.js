// var http = require('http');
// var fs = require('fs');
// var Emitter = require('events').EventEmitter;
// var emitter = new Emitter();
// var route = require('route.js')
// // var clients = [];
// var matchUrl =function(url) {
// 	return function(path) {
// 		return 
// 	}

// }
// 	// if(clients.indexOf(req.connection.remoteAddress));
// 	// 	clients.push(req.connection.remoteAddress);
// 	// console.log("requested",req.connection.remoteAddress);
// 	// if(clients.length==1){
// 	// 	console.log(clients.length);
// 	// 	res.write("wait");
// 	// 	// res.end()
// 	// }
// 	// else{
// 	// 	emitter.emit("play",res);
// 	// 	// res.write("play")
// 	// 	res.end();
// 	// }
// var get_handler = function(req,res) {
// 	var handlers= route.get_handler.filter(matchUrl(req.url));
// }


// 	var handler = function(req,res) {
// 	if(req.method=='POST')
// 		get_handler();
// 		// req.on('data',function(data){
// 		// 	console.log(data.toString());
// 		// });
// 		// res.writeHead(301,{date: new Date(),'content-type': 'text/html'});
// 		// res.end();
// 	if(req.method == 'GET')
// 		post_handlers();
// 	else
// 		file_not_found();
// 	// 	var fileName = req.url =="/" ? "index.html" : "."+req.url;
// 	// 	fs.readFile(fileName,function(error,data){
// 	// 		if(error){
// 	// 			res.statusCode = 404;
// 	// 			res.end('Not found');
// 	// 			// console.log(res.statusCode);
// 	// 			return;
// 	// 		}
// 	// 		res.statusCode = 200;
// 	// 		// console.log(res.statusCode);
// 	// 		res.end(data);
// 	// 	});
// 	// }
// };
// var server = http.createServer(requestHandler);
// server.listen(4000,console.log("listening at 4000"));
var http = require('http');
var EventEmitter = require('events').EventEmitter;
var routes = require('./route.js');

var get_handlers = routes.get_handlers;
var post_handlers = routes.post_handlers;
var rEmitter = new EventEmitter();
var matchHandler = function(url){
	return function(ph){
		return url.match(new RegExp(ph.path));
	};
};
rEmitter.on('next', function(handlers, req, res, next){
	if(handlers.length == 0) return;
	var ph = handlers.shift();
	ph.handler(req, res, next);
});
var handle_all_post = function(req, res){
	var handlers = post_handlers.filter(matchHandler(req.url));
	// console.log(handlers.map(function(ph){
	// 	return ph.path;
	// }));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
}; 
var handle_all_get = function(req, res){
	var handlers = get_handlers.filter(matchHandler(req.url));
	// console.log(handlers.map(function(ph){
	// 	return ph.path;
	// }));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
};

var requestHandler = function(req, res){
	// console.log(req.method, req.url);
	if(req.method == 'GET')
		handle_all_get(req, res);
	else if(req.method == 'POST')
		handle_all_post(req, res);
	else
		method_not_allowed(req, res);
};

var server = http.createServer(requestHandler);
server.listen(3000);

