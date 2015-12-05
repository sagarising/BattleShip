var playerName= function(){
	$('h3')[0].innerHTML=document.cookie;	
};

var fillBox=function(self){
	var coordianteBox = $('#text')[0];
	coordianteBox.value = self.id;
};

var createPlayer = function(){
	if($('#name')[0].value=='')
		alert('first enter your name')
	else{
		req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status ==200) {
				console.log("welcome");
				window.location.href = 'shipPlacingPage.html'
			}
		}
		req.open('POST','player',true);
		req.send('name='+$('#name')[0].value);
	}
}

var sendToGamePage = function(){
	var req = new XMLHttpRequest;
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			console.log(req.responseText);
			if(+req.responseText)
				window.location.href='game.html';
			$('img')[0].style.visibility='visible';
			$('#selectShip')[0].style.visibility='hidden';
			$('table')[0].style.pointerEvents='none';
		}
	}
	req.open('GET',"makeReady",true);
	req.send();
}

var checkAndSubmit = function(){
	var req = new XMLHttpRequest();
	var ship = $('#ship')[0];
	var shipName = ship.options[ship.selectedIndex].text;
	var shipSize = $('#ship')[0].value;
	var coordinateValue = $("#text")[0].value;
	var align = $("#horizontal")[0].checked ? 'horizontal' :'vertical';	
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			var shipCoordinate = JSON.parse(req.responseText); 
			var ship = $('#ship')[0];
			ship.remove(ship.selectedIndex);
			if(ship.children.length==0)
				setInterval(sendToGamePage,20); 
			shipCoordinate.map(function(element){
			var cell = $('#'+element)[0];
			cell.bgColor ='grey';
			});
		}
	}
	req.open('POST','placingOfShip',true);
	req.send(shipName+" "+shipSize+" "+coordinateValue+" "+align);
};	

var updateForShipPlacing = function(){
	var req =new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			var shipCoordinate = JSON.parse(req.responseText); 
			var ship = $('#ship')[0];
				ship.remove(ship.selectedIndex);
				if(ship.children.length==0)
					setInterval(sendToGamePage,20); 
				shipCoordinate.map(function(element){
				var cell = $('#'+element)[0];
				cell.bgColor ='grey';
				});
			}
		}
	req.open('GET','placingOfShip',true);
	req.send();
};






var changeTheColorOfGamePage = function(){
	req=new XMLHttpRequest();
	req.onreadystatechange=function(){
		if(req.readyState==4 && req.status==200){
			changingTheColorOfGrid('own',JSON.parse(req.responseText),'grey')
		}
	}
	req.open('GET','usedSpace',true);
	req.send();
};

var statusUpdate = function(clas,array){
	console.log('enteredddd----')
	array.forEach(function(each,index){
		if(!each){
			var ship = $('.'+clas+' tr')[1].children[index+1];
			ship.style.color = "red";
			ship.innerHTML = "Sunk";
		}
	});
};

var changingTheColorOfGrid=function(clas,array,colour){
	array.forEach(function(eachCoordinate){
		$('.'+clas+' [id='+eachCoordinate+']')[0].style.backgroundColor=colour;
	});
};

var attack = function(point) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status ==200){
			var data = JSON.parse(req.responseText);
			console.log(data);
			if(!data)
				alert("not your turn");
		};
	};
	req.open('POST','attack',true);
	req.send(point.id);
};


var update = function(){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200) {
			var updates = JSON.parse(req.responseText);
			var shipStatus = updates.splice(0,2);
			shipStatus.forEach(function(eachPlayer){
				statusUpdate(eachPlayer.table,eachPlayer.stat);
			});
			updates.forEach(function(clas){
				changingTheColorOfGrid(clas.table,clas.stat,clas.color)
			})
		};
	};
	req.open('GET','givingUpdate',true);
	req.send();
};


var serveStatus = function(){
	playerName();
	changeTheColorOfGamePage();
	setInterval(update,500);
};

