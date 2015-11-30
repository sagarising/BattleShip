var createPlayer = function(){
	req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(req.readyState == 4 && req.status ==200) {
			document.getElementsByTagName('button')[1].style.display='inline';
		}
	}
	req.open('POST','player',true);
	req.send('name='+document.querySelector('#name').value);
}