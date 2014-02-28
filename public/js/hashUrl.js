$(document).ready(function(){
	setTimeout(function(){
		var hash = window.location.hash.split("#")[1];
    	if(hash.length > 30)
	    	window.location.href = "login?retUrl=" + hash;
	    else
	    	window.location.href = "login";
	}, 1000);
});
