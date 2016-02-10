var welcome = function(){
	var str="Hey! Guess what, I was waiting for you! Enter your name and click on start button. If you want to play with your friend enter game id also.";
	var length=str.length;
	var index=0;
	setInterval(function(){
		if(index==length)
			return;
		var text = $("#welcome").text();
		text+=str[index++];
		$("#welcome").html(text);
	},100);
};

setTimeout(welcome,500);

var login = function() {
	var Name = $("#name").val();
	if(!Name)
		return;
	var GameId = $("#gameId").val();
	$.post('login',{name: Name, gameId:GameId},function(data){
		if(data=="Game is booked.")
			$('#gameId').val(""),$('#gameId').attr("placeholder",data+"Choose another id.");
		else
			$('body').html(data);
	});
};

$(window).on('beforeunload',function(){
	return 'Game data will be lost';
})