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
	array.forEach(function(each){
		$('.'+clas)[0].children[0].children[1].children[each+1].innerHTML='Sunk'
	})
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
			if(data.message){
				alert("not your turn");

			}
			else if(+data.hit_miss[0])
				point.innerHTML = "hit";
			else
				point.innerHTML = "miss";
			if(data.sunkShips.length)
				 statusUpdate('enemyStatusTable',data.sunkShips);
		}

	}
	req.open('POST','attack',true);
	req.send(point.id);
};


var update = function(){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200) {
			console.log(req.responseText)
			var shipStatus = JSON.parse(req.responseText);
			console.log(shipStatus);
			
		}
	}
	req.open('GET','givingUpdate',true);
	req.send();
};


window.onload = function(){
	setInterval(update,500);
};

