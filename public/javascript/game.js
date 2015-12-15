var playerName= function(){
	$('h3').append(document.cookie);	
};


var soundPlay=function(){
	var audio = $("#mysoundclip")[0];
		audio.play();
};

$(".firstpage").ready(function(){
    $("#name").keypress(function(ev){
      	if (ev.which == '13') 
       		createPlayer();
    });
});

var createPlayer = function(){
	soundPlay();
	if($('#name').val() =='')
		alert('first enter your name')
	else{
		$.post('player',{ name : $('#name').val()},
		function(data){
			window.location.href = 'shipPlacingPage.html';
		});
	};
};

var checkAndSubmit = function(self){
	soundPlay();
	var ship = $("#ship");
	var shipName = ship[0].options[ship[0].selectedIndex].text;
	var shipSize = ship.val();
	var coordinateValue = self.id;
	var align = $("#horizontal")[0].checked ? 'horizontal' :'vertical';	
	$.post('placingOfShip',{shipName:shipName,shipSize:shipSize,
		coordinate:coordinateValue,align:align
		},
		function(data){
			var shipCoordinate = JSON.parse(data); 
			var ship = $('#ship')[0];
			ship.remove(ship.selectedIndex);
			if(ship.children.length==0){
				$('#ready').css({"pointer-events":"auto","opacity":"1","animation":"scale 0.5s infinite alternate"}); 
				$('#placeShip').css({"pointer-events":"none","opacity":"0.5"});
			};
			shipCoordinate.map(function(element){
				$('#'+element).css("background-color","darkslategrey");
		});
	});
};

var updateForShipPlacing = function(){
	$.get('placingOfShip',function(data){
		var shipCoordinate = JSON.parse(data); 
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

var sendToGamePage = function(){
	$.get('makeReady',function(data){
		data = JSON.parse(data);
		if(data==='select more ships'){
			$('#alert').show();
		}
		else{
			if(data===true)
				window.location.href = "game.html";
			$('#loading').css('visibility','visible');
			$('#selectShip').css('visibility','hidden');
			$('table').css('pointerEvents','none');
		}
	})
};

var changeTheColorOfGamePage = function(){
	$.get('usedSpace',function(data){
		placesWhereShipArePlaced = JSON.parse(data);
		changingTheColorOfGrid('own',placesWhereShipArePlaced,'grey');
	});
};

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

var attack = function(point) {
	$.post('attack',{point:point.id},function(data){
		
	});
	$(point).addClass("noClick");
	soundPlay();
};

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
		var updates = JSON.parse(data);
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
		var updates = JSON.parse(data);
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

