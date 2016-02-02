var sound_on_off = function() {
     if($('#soundSwitch').text() == 'SOUND ON') {       
        $('audio').each(function(){
			this.play(); 
    		this.currentTime = 0;
		});
       		$('#soundSwitch').text('SOUND OFF');
     }
     else {
     	$('audio').each(function(){
			this.pause(); 
    		this.currentTime = 0;
		});  
        $('#soundSwitch').text('SOUND ON'); 
     }
};


var login = function() {
	var Name = $("#name").val();
	var GameId = $("#gameId").val();
	$.post('login',{name: Name, gameId:GameId},function(data){
		$('html').html(data);
	});
}