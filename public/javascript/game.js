
// gamepage
var intervalObject;

var changeTheColorOfGamePage = function(){
	$.get('usedSpace',function(data){
		placesWhereShipArePlaced = data;
		changingTheColorOfGrid('own',placesWhereShipArePlaced,'grey');
	});
};

var attack = function(point) {
	$.post('attack',{point:point.id},function(data){});
	$(point).addClass("noClick");
	$(point).css("animation","scale_once 0.5s 1 alternate");
	soundPlay();
};


var soundPlay=function(){
	var audio = $("#mysoundclip")[0];
	audio.play();
};

//gamePage

//
var changingTheColorOfGrid=function(clas,usedSpace,colour){
	usedSpace.forEach(function(eachCoordinate){
		$('.'+clas+' [id='+eachCoordinate+']').css("background-color",colour);
	});
};

var statusUpdate = function(id,array){
	array.forEach(function(each,index){
		if(!each){
			var ship = $('#'+id+' tr')[1].children[index+1];
			ship.style.color = "red";
			ship.innerHTML = "Sunk";
		};
	});
};

//gamePage

var displayTurn = function(turn){
	if(turn == true){
		$( ".turn" ).html( "<p>Your turn</p>" );
		$("#enemy").css("pointer-events","auto");
	}
	else{
		$( ".turn" ).html( "<p>Enemy's turn</p>" );
		$("#enemy").css("pointer-events","none");
	};
};

var update = function(){
	$.get('givingUpdate',function(data){
		var shipStatus = [];
		var gridStatus = [];
		var updates = data;
		var playerTurn = updates.isTurn;
		displayTurn(playerTurn);
		shipStatus = [updates.ownStatusTable,updates.enemyStatusTable];
		shipStatus.forEach(function(eachPlayer){
			statusUpdate(eachPlayer.table,eachPlayer.stat);
		});
		var gridStatus = [updates.ownHit,updates.enemyMiss,updates.enemyHit];
		gridStatus.forEach(function(clas){
			changingTheColorOfGrid(clas.table,clas.stat,clas.color)
		});
		if(updates.isGameOver){
			clearInterval(intervalObject);
			$.get('getResult',function(data){
				$('html').html(data);
				winnerAndLoser(update);
			})
		};
	});
};

var hitAccuracy = function(player){
	var attempts = player.hits.length + player.misses.length;
	var ratioOfHits = player.hits.length / attempts ;
	var percentage = Math.round(ratioOfHits*100);
	return percentage+"%";
}

var Context = function(updates){
	console.log(updates,"updates");
	var winner = JSON.parse(updates.won);
	var loser = JSON.parse(updates.lost);
	this.winner = winner.name;
	this.loser = loser.name;
	this.winnerStatus = updates.status.filter(function(ele){return ele==0}).length+"/5";
	this.loserStatus = "5/5";
	this.winnerAccuracy = hitAccuracy(winner);
	this.loserAccuracy =  hitAccuracy(loser);
}

var winnerAndLoser = function(update){
	$.get('gameOver',function(data){
		console.log(data,"data");
		var updates = data;
		var winnerShipsSunk = updates.status.filter(function(ele){return ele==0}).length;
		var context = new Context(updates);
		var source = $('#declare').html();
		var template = Handlebars.compile(source);
		$('#result').html(template(context));
		changingTheColorOfGrid('enemy',JSON.parse(updates.won).misses,'#ccfff4')
		changingTheColorOfGrid('enemy',JSON.parse(updates.won).hits,'red')
		changingTheColorOfGrid('own',JSON.parse(updates.won).grid.usedCoordinates,'grey')
		changingTheColorOfGrid('own',JSON.parse(updates.lost).misses,'#ccfff4')
		changingTheColorOfGrid('own',JSON.parse(updates.lost).hits,'red')
		changingTheColorOfGrid('enemy',JSON.parse(updates.lost).grid.usedCoordinates,'grey')
	})
	soundPlay();
};

var serveStatus = function(){
	changeTheColorOfGamePage();
	intervalObject = setInterval(update,2000);
};


var highscore = function(){
	$.get('highscore',function(data){
		var parsedData = JSON.parse(data);
		$('#top1name').append(parsedData[0].name);
		$('#top2name').append(parsedData[1].name);
		$('#top3name').append(parsedData[2].name);
		$('#top4name').append(parsedData[3].name);
		$('#top5name').append(parsedData[4].name);

		$('#top1accuracy').append(parsedData[0].accuracy+'%');
		$('#top2accuracy').append(parsedData[1].accuracy+'%');
		$('#top3accuracy').append(parsedData[2].accuracy+'%');
		$('#top4accuracy').append(parsedData[3].accuracy+'%');
		$('#top5accuracy').append(parsedData[4].accuracy+'%');

		$('#top1time').append(parsedData[0].time);
		$('#top2time').append(parsedData[1].time);
		$('#top3time').append(parsedData[2].time);
		$('#top4time').append(parsedData[3].time);
		$('#top5time').append(parsedData[4].time);


	});
};