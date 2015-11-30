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
rEmitter.on('next', function(handlers, req, res, next,ip){
	if(handlers.length == 0) return;
	var ph = handlers.shift();
	ph.handler(req, res, next,ip);
});
var handle_all_post = function(req, res,name){
	var handlers = post_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next,name);
	};
	next();
}; 
var handle_all_get = function(req, res,num){
	var handlers = get_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next,num);
	};
	next();
};

var requestHandler = function(req, res){
	var playerName=req.headers.cookie;
	if(req.method == 'GET')
		handle_all_get(req, res);
	else if(req.method == 'POST')
		handle_all_post(req, res,playerName);
	else
		method_not_allowed(req, res);
};

var server = http.createServer(requestHandler);
server.listen(3000,console.log('listening at 3000'));