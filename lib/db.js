var pg = require('pg');
var _ = require('lodash');
var db = {};
db.insertInfo = function(name,accuracy) {
	var conString = "postgres://postgres:Nabeel95@localhost:5432/battleship";
	pg.connect(conString,function(err,client,done){
		if(err) return console.error('error :',err);
		client.query("insert into highscores (name,accuracy) VALUES('"+name+"',"+accuracy+")",function(err,result){
			if(err) console.log(err);
			done()});
	});
}

module.exports=db;