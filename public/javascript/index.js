var createPlayer = function(){
	document.getElementsByTagName('button')[1].style.display='inline';
	if(document.querySelector('#name').value==''){
		alert('first enter your name')
	}
	else{
		req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status ==200) {
				console.log("welcome");
			}
		}
		req.open('POST','player',true);
		req.send('name='+document.querySelector('#name').value);
	}
}

window.onload = function(){
	document.querySelector('#submitName').onclick = createPlayer;
};
