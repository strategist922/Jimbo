var SPEED = 80;
$(document).ready(function(){
	var snippetId = window.location.hash.split("#")[1];

	//add users list to the top of page with their colors
	var addUser = function(user) {
		_square = $("<div>").addClass("userSquare").css("background-color", user.color).attr("data-username", user.username).tooltip({
            placement: "bottom",
            title: user.username
        }).append($("<img>").attr("src", "../img/zodiac/" + user.zodiac + ".png"));
        $(".nav.pull-right").prepend(_square);
    }
	var layout = function() {
		$(".loading-panel").show();
		var _height = document.documentElement.clientHeight - $(".navbar").height() - 30;
		$(".reviewArea").height(_height);
	}
	layout();

	var createStyle = function(name, color) {
		$('style').remove();
	    $('head').append('<style type="text/css">.' + name +' {background: ' + color + ';}</style>');
	}

	var initView = function(){
		var user = JSON.parse(sessionStorage["userObj"]);
		addUser(user);
		createStyle(user.username, user.color);
		var mode = snippetId.split("-")[snippetId.split("-").length - 1];
		if(mode == "js") mode = "javascript";
		var elem = document.getElementById("editorTextArea");
		var editor = CodeMirror.fromTextArea(elem, {
			mode: "text/" + mode,
			lineNumbers: true,
			theme: "solarized light"
		});
	    $(editor.getWrapperElement()).height($(".reviewArea").height() - 30).css("font-size","1.1em !important");
	    window.xxxEditor = editor;
	    setTimeout(function(){
            editor.refresh();
        }, 10);
	}
	initView();
	var getOps = function(name) {
		$.ajax({
		  	type: "GET",
		  	url: "/getOps/" + name,
		  	success: function(data){
		  		if(!data.error){
		  			$(".loading-panel").hide();
		  			$(".container-fluid").removeClass("hidden");
		  			var ops = data.ops;
				    var i = 0;
					function replayCode() {
					    ar = JSON.parse(ops[i]);
					    var currentUser = JSON.parse(sessionStorage["userObj"]);
					    var userClass = currentUser[ar.meta.source];
					    if (ar.op.length > 1) {
					    	for(var j = 0; j < ar.op.length; j++){
					    		var pos = xxxEditor.posFromIndex(ar.op[j].p);
						    	if (ar.op[j].hasOwnProperty("i")) {
						            toPos = xxxEditor.posFromIndex(ar.op[j].p + ar.op[j].i.length);
						            xxxEditor.doc.replaceRange(ar.op[j].i, pos, toPos);
						            var mark = xxxEditor.doc.markText(pos, toPos, {className:userClass});
						        } else if (ar.op[j].hasOwnProperty("d")) {
						            toPos = xxxEditor.posFromIndex(ar.op[j].p + ar.op[j].d.length);
						            xxxEditor.doc.replaceRange("", pos, toPos);
						        }
					    	}
					    } else {
					        var firstOp = ar.op[0];
					        var pos = xxxEditor.posFromIndex(firstOp.p)
					        if (firstOp.hasOwnProperty("i")) {
					        	var toPos = new Object();
					        	toPos.line = pos.line;
					        	toPos.ch = pos.ch + firstOp.i.length;
					            xxxEditor.doc.replaceRange(firstOp.i, pos);
					            var mark = xxxEditor.doc.markText(pos, toPos, {className:userClass});
					            console.log(mark);
					        } else if (firstOp.hasOwnProperty("d")) {
					            var toPos = xxxEditor.posFromIndex(firstOp.p + firstOp.d.length);
					            xxxEditor.doc.replaceRange("", pos, toPos)
					        }
					    }
					    i++;
					    if (i < ops.length)
					        setTimeout(replayCode, SPEED);
					}
					replayCode();
		  		}
		  		else
		  			console.log(data.error);
		  	},
		  	dataType: "json"
		});
	}

	getOps(snippetId);
});