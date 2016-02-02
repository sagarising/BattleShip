


var login = function() {
	var Name = $("#name").val();
	var GameId = $("#gameId").val();
	$.post('login',{name: Name, gameId:GameId},function(data){
		$('html').html(data);
	});
}