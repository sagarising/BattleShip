var playerName= function(){
	$('h3').html(document.cookie);	
};

var fillBox=function(self){
	var coordianteBox = $('#text')[0];
	coordianteBox.value = self.id;
};

var createPlayer = function(){
	if($('#name').val() =='')
		alert('first enter your name')
	else{
		$.post('player',{ name : $('#name').val()},
		function(data){
			window.location.href = 'shipPlacingPage.html';
		});
	}
}

var checkAndSubmit = function(){
	var ship = $("#ship");
	var shipName = ship[0].options[ship[0].selectedIndex].text;
	var shipSize = ship.val();
	var coordinateValue = $("#text").val();
	var align = $("#horizontal")[0].checked ? 'horizontal' :'vertical';	
	$.post('placingOfShip',{shipName:shipName,shipSize:shipSize,
		coordinate:coordinateValue,align:align
		},
		function(data){
			var shipCoordinate = JSON.parse(data); 
			var ship = $('#ship')[0];
			ship.remove(ship.selectedIndex);
			if(ship.children.length==0){
				$('#ready').css({"pointer-events":"auto","opacity":"1"}); 
				$('#placeShip').css({"pointer-events":"none","opacity":"0.5"});
			};
			shipCoordinate.map(function(element){
				$('#'+element).css("background-color","darkslategrey");
		});
	})
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
	})
};

var sendToGamePage = function(){
	$.get('makeReady',function(data){
		if(+data)
			window.location.href = "game.html";
		$('img').css('visibility','visible');
		$('#selectShip').css('visibility','hidden');
		$('table').css('pointerEvents','none');
	})
}

var changeTheColorOfGamePage = function(){
	$.get('usedSpace',function(data){
		console.log(data);
		placesWhereShipArePlaced = JSON.parse(data);
		changingTheColorOfGrid('own',placesWhereShipArePlaced,'grey');
	})
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
		}
	});
};


var attack = function(point) {
	$.post('attack',{point:point.id},function(data){
		if(!JSON.parse(data))
			alert("not your turn");
	})
};


var update = function(){
	$.get('givingUpdate',function(data){
		var updates = JSON.parse(data);
		var shipStatus = updates.splice(0,2);
		shipStatus.forEach(function(eachPlayer){
			statusUpdate(eachPlayer.table,eachPlayer.stat);
		});
		var gridStatus = updates.splice(0,3)
		gridStatus.forEach(function(clas){
			changingTheColorOfGrid(clas.table,clas.stat,clas.color)
		});
		if(updates[0].status){
			window.location.href = "result.html";
		}
	})
};

var winnerAndLoser = function(update){
	$.get('givingUpdate',function(data){
		var updates = JSON.parse(data);
		var players = updates[6];
		var myShipsSunk = updates[0].stat.filter(function(ele){return ele==0}).length;
		var enemyShipsSunk = updates[1].stat.filter(function(ele){return ele==0}).length;
		if(enemyShipsSunk<myShipsSunk)
			var context = {winner:updates[5].winner,loser:updates[5].loser,winnerStatus:enemyShipsSunk+'/5',loserStatus:myShipsSunk+'/5'};
		var context = {winner:updates[5].winner,loser:updates[5].loser,winnerStatus:myShipsSunk+'/5',loserStatus:enemyShipsSunk+'/5'};
		var source = $('#declare').html();
		var template = Handlebars.compile(source);
		$('#result').html(template(context));
		changingTheColorOfGrid('own',players.mySelf.misses,'#ccfff4')
		changingTheColorOfGrid('own',players.mySelf.hits,'red')
		changingTheColorOfGrid('enemy',players.enemy.misses,'#ccfff4')
		changingTheColorOfGrid('enemy',players.enemy.hits,'red')
		changingTheColorOfGrid('enemy',players.mySelf.grid.usedCoordinates,'grey')
		changingTheColorOfGrid('own',players.enemy.grid.usedCoordinates,'grey')
	})

}

var serveStatus = function(){
	playerName();
	changeTheColorOfGamePage();
	setInterval(update,500);
};

