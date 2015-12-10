var playerName= function(){
	$('h3').append(document.cookie);	
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
	};
};

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
				$('#ready').css({"pointer-events":"auto","opacity":"1","animation":"scale 0.5s infinite alternate"}); 
				$('#placeShip').css({"pointer-events":"none","opacity":"0.5"});
			};
			shipCoordinate.map(function(element){
				var cell = $('#'+element)[0];
				cell.bgColor ='darkslategrey';
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
		console.log(data);
		data = JSON.parse(data);
		console.log(data===true);
		if(data==='select more ships'){
			$('#alert').show();
		}
		else{
			if(data===true)
				window.location.href = "game.html";
			$('img').css('visibility','visible');
			$('#selectShip').css('visibility','hidden');
			$('table').css('pointerEvents','none');
		}
	})
};

var changeTheColorOfGamePage = function(){
	$.get('usedSpace',function(data){
		console.log(data);
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
		if(!JSON.parse(data))
			alert("not your turn");
	});
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
		if(updates.result.status){
			window.location.href = "result.html";
		};
	});
};

var winnerAndLoser = function(update){
	$.get('givingUpdate',function(data){
		var updates = JSON.parse(data);
		$('div').html("<h2 align='center'>Winner ->  "+updates.result.winner+"</h2><br><h2>Looser ->  "+updates.result.looser+"</h2>")
	});

};

var serveStatus = function(){
	playerName();
	changeTheColorOfGamePage();
	setInterval(update,500);
};

