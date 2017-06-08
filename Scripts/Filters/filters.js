itApp.filter('newLines', function(){
	return function(text){
		return text.replace(/\n/g, '<br/>');
	}
});
