
// gamepage
var playerName= function(){
	$('h3').append($.cookie('name')+"<small> GameID:</small>"+$.cookie('gameId'));	
};
var changeTheColorOfGamePage = function(){
	$.get('usedSpace',function(data){
		placesWhereShipArePlaced = data;
		changingTheColorOfGrid('own',placesWhereShipArePlaced,'grey');
	});
};

var attack = function(point) {
	$.post('attack',{point:point.id},function(data){});
	$(point).addClass("noClick");
	soundPlay();
};

//Associate function
var soundPlay=function(){
	var audio = $("#mysoundclip")[0];
	audio.play();
};

var updateForShipPlacing = function(){
	$.get('placingOfShip',function(data){
		var shipCoordinate = data; 
		var ship = $('#ship')[0];
		ship.remove(ship.selectedIndex);
		if(ship.children.length==0)
			setInterval(sendToGamePage,20); 
		shipCoordinate.map(function(element){
		var cell = $('#'+element)[0];
		cell.bgColor ='grey';
		});
	});
};

//shipPlacingPage


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
		$( ".controller" ).html( "<p>Your turn</p>" );
		$("#enemy").css("pointer-events","auto");
	}
	else{
		$( ".controller" ).html( "<p>Enemy's turn</p>" );
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
			window.location.href = "result.html";
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
	playerName();
	changeTheColorOfGamePage();
	setInterval(update,150);
};

