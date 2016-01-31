var pg = require('pg');
var _ = require('lodash');
var db = {};
var con ={
		host     : process.env.OPENSHIFT_POSTGRESQL_DB_HOST||"127.0.0.1",
		user     : process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME||"admin3uxsxtt",
		password : process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD||"ZAhH2aFZmCYG",
		port     : process.env.OPENSHIFT_POSTGRESQL_DB_PORT||"5433",
		database : 'battleship',
	};

db.insertInfo = function(name,accuracy) {
	var conString = 'postgres://'+con.user+':'+con.password+'@'+con.host+':'+con.port+'/'+con.database;
	pg.connect(conString,function(err,client,done){
		if(err) return console.error('error :',err);
		client.query("insert into highscores (name,accuracy,time) VALUES('"+name+"',"+accuracy+",localtimestamp)",function(err,result){
			if(err) console.log(err);
			done()});
	});
};

db.getHighscore = function(res){
	var result = [];
	var conString = 'postgres://'+con.user+':'+con.password+'@'+con.host+':'+con.port+'/'+con.database;
	pg.connect(conString,function(err,client,done){
		if(err) console.log(err);
		var query = client.query('select * from highscores order by accuracy desc limit 5')
		query.on('row',function(row){
			result.push(row);
		});
		query.on('end',function(){
			client.end();
			res.send(JSON.stringify(result));
		});
	});
}

module.exports=db;
