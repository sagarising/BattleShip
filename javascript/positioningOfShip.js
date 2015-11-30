var fillBox=function(self){
	var coordianteBox = document.getElementById('text');
	coordianteBox.value = self.id;
};

var loadingIcon=function(){
	document.getElementById('loading').style.visibility='visible'
}

var checkAndSubmit = function(){
	var shipName = document.getElementById("ship").value;
 	var coordinateValue = document.getElementById("text").value;
 	var align = document.getElementById("horizontal").checked ? 'horizontal' :'vertical';
	var ship = document.querySelector('#ship')
	ship.remove(ship.selectedIndex);
	// changingTheColor(clas,warShip.coordinates,'grey');
	alert(shipName+'=name '+coordinateValue+'=coord '+align)
};	

var changingTheColor=function(clas,array,colour){
	var p = document.querySelector('#'+clas).getElementsByTagName('td');
	for(var i=0;i<array.length;i++){
		p[array[i]].setAttribute("style","background-color:"+colour);
	};
};