
// gamepage
var playerName= function(){
	$('h3').append((document.cookie).split('=')[1]);	
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
		console.log(playerTurn,"whose turn")
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
	var winner = updates.winner;
	var loser = updates.loser;
	this.winner = winner.name;
	this.loser = loser.name;
	this.winnerStatus = updates.shipsStatus.filter(function(ele){return ele==0}).length+"/5";
	this.loserStatus = "5/5";
	this.winnerAccuracy = hitAccuracy(winner);
	this.loserAccuracy =  hitAccuracy(loser);
}

var winnerAndLoser = function(update){
	$.get('gameOver',function(data){
		var updates = data;
		var winnerShipsSunk = updates.shipsStatus.filter(function(ele){return ele==0}).length;
		var context = new Context(updates);

		 // {winner:updates.winner.name,loser:updates.loser.name,winnerStatus:winnerShipsSunk+'/5',loserStatus:'5/5',
						// winnerAccuracy:'56',loserAccuracy:'45'};
		var source = $('#declare').html();
		var template = Handlebars.compile(source);
		$('#result').html(template(context));
		changingTheColorOfGrid('enemy',updates.winner.misses,'#ccfff4')
		changingTheColorOfGrid('enemy',updates.winner.hits,'red')
		changingTheColorOfGrid('own',updates.winner.grid.usedCoordinates,'grey')
		changingTheColorOfGrid('own',updates.loser.misses,'#ccfff4')
		changingTheColorOfGrid('own',updates.loser.hits,'red')
		changingTheColorOfGrid('enemy',updates.loser.grid.usedCoordinates,'grey')
	})
	soundPlay();
};

var serveStatus = function(){
	playerName();
	changeTheColorOfGamePage();
	setInterval(update,120);
};

