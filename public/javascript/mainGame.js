var playerName= function(){
	$('h3')[0].innerHTML=document.cookie;	
};

var fillBox=function(self){
	var coordianteBox = document.getElementById('text');
	coordianteBox.value = self.id;
};

var createPlayer = function(){
	document.getElementsByTagName('button')[1].style.display='inline';
	if(document.querySelector('#name').value=='')
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
		req.send('name='+document.querySelector('#name').value);
	}
}

var sendToGamePage = function(){
	var req = new XMLHttpRequest;
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			console.log(req.responseText);
			if(+req.responseText)
				window.location.href='game.html';
			document.getElementsByTagName('img')[0].style.visibility='visible';
			document.getElementById('selectShip').style.visibility='hidden';
			document.getElementsByTagName('table')[0].style.pointerEvents='none';
		}
	}
	req.open('GET',"makeReady",true);
	req.send();
}

var checkAndSubmit = function(){
	var req = new XMLHttpRequest();
	var ship = document.getElementById("ship");
	var shipName = ship.options[ship.selectedIndex].text;
	var shipSize = document.getElementById("ship").value;
	var coordinateValue = document.getElementById("text").value;
	var align = document.getElementById("horizontal").checked ? 'horizontal' :'vertical';	
	req.onreadystatechange = function(){
		if(req.readyState==4 && req.status==200){
			var shipCoordinate = JSON.parse(req.responseText); 
			var ship = document.querySelector('#ship');
			ship.remove(ship.selectedIndex);
			if(ship.children.length==0)
				setInterval(sendToGamePage,20); 
			shipCoordinate.map(function(element){
			var cell = document.getElementById(element);
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
			var ship = document.querySelector('#ship');
				ship.remove(ship.selectedIndex);
				if(ship.children.length==0)
					setInterval(sendToGamePage,20); 
				shipCoordinate.map(function(element){
				var cell = document.getElementById(element);
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
			changingTheColor('own',JSON.parse(req.responseText),'grey')
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
var changingTheColor=function(clas,array,colour){
	var p = document.querySelector('#'+clas).getElementsByTagName('td');
	for(var i=0;i<array.length;i++){
		p[array[i]].setAttribute("style","background-color:"+colour);
	};
};
var attack = function(point) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status ==200){
			var data = JSON.parse(req.responseText);
			console.log(data);
			if(!Array.isArray(data))
				alert("not your turn");
			else if(data[0])
				point.innerHTML = "hit";
			else
				point.innerHTML = "miss";
			// statusUpdate('enemyStatusTable',data.slice(1));
		};
	};
	req.open('POST','attack',true);
	req.send(point.id);
};

// var displayOwnHitPoints = function(clas,coordinates){
// 	console.log(coordinates,'coordinates saala')
// 	coordinates.forEach(function(coordinate){
// 		$("."+clas+" [id='"+coordinate+"']").css('background-color','red');
// 	});
// }



var update = function(){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200) {
			console.log(req.responseText)
			var updates = JSON.parse(req.responseText);
			// statusUpdate('ownStatusTable',updates.statusOfShips);
			// displayOwnHitPoints("own",updates.destroyedPoints)
			var ownHitPoint = updates.splice(2,1);
			// console.log(ownHitPoint[0].stat,'own hit point.stat')
			updates.forEach(function(eachPlayer){
				statusUpdate(eachPlayer.table,eachPlayer.stat);
			});
			changingTheColor(ownHitPoint[0].table,ownHitPoint[0].stat,'red')
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

