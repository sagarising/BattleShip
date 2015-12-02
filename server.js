var http = require('http');
var EventEmitter = require('events').EventEmitter;
var routes = require('./route.js');
var d = require('domain').create();
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
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
}; 
var handle_all_get = function(req, res){
	var handlers = get_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
};

var requestHandler = function(req, res){
	// process.on('uncaughtException',function(err){
	// console.log(err);
	// res.end();
	// });
	if(req.method == 'GET')
		handle_all_get(req, res);
	else if(req.method == 'POST')
		handle_all_post(req, res);
	else
		method_not_allowed(req, res);
};


d.on('error',function(er){
	console.log(er.message);
});

d.run(function(){
	var server = http.createServer(requestHandler);
	server.listen(3000);
	console.log("server listening on 3000");
});

