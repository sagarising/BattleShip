var fillBox=function(self){
	var coordianteBox = document.getElementById('text');
	coordianteBox.value = self.id;
};

var checkAndSubmit = function(){
	var shipName = document.getElementById("ship").value;
 	var coordinateValue = document.getElementById("text").value;
 	var align = document.getElementById("horizontal").checked ? 'horizontal' :'vertical';
	var ship = document.querySelector('#ship')
	ship.remove(ship.selectedIndex);
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(req.readyState ==4 && req.status == 200){
			var res = JSON.parse(req.responseText);
			if(res.result == 'ok'){
				changingTheColor('own',res.ship,'grey');
			}
		}
	}
	req.open('POST','place',true);
	req.send('shipName='+shipName+'&align='+align+'&fp='+coordinateValue);
};	

var changingTheColor=function(clas,array,colour){
	var p = document.querySelector('.'+clas).getElementsByTagName('td');
	for(var i=0;i<array.length;i++){
		p[array[i]].setAttribute("style","background-color:"+colour);
	};
};

var isSecondPlayerReady = function() {
	req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status ==200) {
				var res = req.responseText;
				if(res =='wait')
					document.querySelector('#wait').innerHTML = res;
				else
					document.querySelector('html').innerHTML = res;
			}
		}
	req.open('GET','ready',true);
	req.send()
}
