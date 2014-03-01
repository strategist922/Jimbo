var SPEED = 80;
$(document).ready(function(){
	var snippetId = window.location.hash.split("#")[1];
	var contributers = [];
	var contributersObj = [];
	var _randomColor = function() {
	    var h = Math.floor(Math.random() * 360);
	    var s = Math.random() * 0.4 + 0.5;
	    var l = Math.random() * 0.6 + 0.3;
	    var c = 'hsl(' + h + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';

	    return c;
	}

	//add users list to the top of page with their colors
	var addUser = function(user) {
		_square = $("<div>").addClass("userSquare").css("background-color", user.color).attr("data-username", user.username).tooltip({
            placement: "bottom",
            title: user.username
        });
        if(user.zodiac)
        	_square.append($("<img>").attr("src", user.zodiac));
        $(".nav.pull-right").prepend(_square);
        createStyle(user.username, user.color);
    }

	var layout = function() {
		$(".loading-panel").show();
		var _height = document.documentElement.clientHeight - $(".navbar").height() - 30;
		$(".reviewArea").height(_height);
	}
	layout();

	var createStyle = function(name, color) {
	    $('head').append('<style type="text/css">.' + name +' {border-bottom: 2px solid ' + color + ';}</style>');
	}

	var initView = function(){
		$("#playButton").attr('disabled', 'disabled');
		var user = JSON.parse(sessionStorage["userObj"]);
		addUser(user);
		var mode = snippetId.split("-")[snippetId.split("-").length - 1];
		if(mode == "js") mode = "javascript";
		var elem = document.getElementById("editorTextArea");
		var timelineSlider = $(".timelineSlider").slider();
		var editor = CodeMirror.fromTextArea(elem, {
			mode: "text/" + mode,
			lineNumbers: true,
			theme: "solarized light",
			readonly: "nocursor"
		});
		$(".CodeMirror").css("border","1px solid #ccc");
	    $(editor.getWrapperElement()).height($(".reviewArea").height() - $(".timelineSlider").height() - 50).css("font-size","1.1em !important");
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
		  			$(".container").removeClass("hidden");
		  			window.ops = data.ops;
		  			$(".timelineSlider").slider({min:0, max: ops.length, step:1});
		  			$(".timelineSlider").slider('disable');
		  			for(var j = 0; j < ops.length; j++) {
		  				var tempOp = JSON.parse(ops[j]);
		  				var op = tempOp.op[0];

		  				var owner = op.owner;
		  				if(owner != undefined && contributers.indexOf(owner) < 0){
		  					if($(".userSquare[data-username='" + owner+ "']").length == 0){
		  						var user = {username: owner, color:_randomColor()}
		  						addUser(user);
		  					}
		  					contributers.push(owner);
		  				}
		  			}
		  			$("#playButton").removeAttr('disabled')
					setSlider();
		  		}
		  		else
		  			console.log(data.error);
		  	},
		  	dataType: "json"
		});
	}
	$("#playButton").click(function(){
		var i = 0;
		xxxEditor.setValue("");
		function replayCode() {
		    ar = JSON.parse(ops[i]);
		    var currentUser = JSON.parse(sessionStorage["userObj"]);
		    $("." + userClass).tooltip({title:currentUser.username});

		    if (ar.op.length > 1) {
		    	for(var j = 0; j < ar.op.length; j++){
		    		var userClass = ar.op[j].owner;
		    		var pos = xxxEditor.posFromIndex(ar.op[j].p);
			    	if (ar.op[j].hasOwnProperty("i")) {
			            xxxEditor.doc.replaceRange(ar.op[j].i, pos);
			            toPos = xxxEditor.posFromIndex(ar.op[j].p + ar.op[j].i.length);
			            var mark = xxxEditor.doc.markText(pos, toPos, {className:userClass});
			        } else if (ar.op[j].hasOwnProperty("d")) {
			            toPos = xxxEditor.posFromIndex(ar.op[j].p + ar.op[j].d.length);
			            xxxEditor.doc.replaceRange("", pos, toPos);
			        }
		    	}
		    } else {
		        var firstOp = ar.op[0];
		        var userClass = firstOp.owner;
		        var pos = xxxEditor.posFromIndex(firstOp.p)
		        if (firstOp.hasOwnProperty("i")) {
		        	var toPos = new Object();
		        	toPos.line = pos.line;
		        	toPos.ch = pos.ch + firstOp.i.length;
		            xxxEditor.doc.replaceRange(firstOp.i, pos);
		            var mark = xxxEditor.doc.markText(pos, toPos, {className:userClass});
		        } else if (firstOp.hasOwnProperty("d")) {
		            var toPos = xxxEditor.posFromIndex(firstOp.p + firstOp.d.length);
		            xxxEditor.doc.replaceRange("", pos, toPos)
		        }
		    }
		    i++;
		    $(".timelineSlider").slider("value", i);
		    if (i < ops.length)
		        setTimeout(replayCode, SPEED);
		    else
		    	$(".timelineSlider").slider('enable');
		}
		replayCode();
	});


	getOps(snippetId);

	var setSlider = function() {
		$(".timelineSlider").slider(
			{slide:function(event, ui){
				var step = ui.value;
				xxxEditor.setValue("");
			    for(var i = 0 ; i < step; i++){
			    	ar = JSON.parse(ops[i]);
				    if (ar.op.length > 1) {
				    	for(var j = 0; j < ar.op.length; j++){
				    		var pos = xxxEditor.posFromIndex(ar.op[j].p);
					    	if (ar.op[j].hasOwnProperty("i")) {
					    		var userClass = ar.op[j].owner;
					            xxxEditor.doc.replaceRange(ar.op[j].i, pos);
					            toPos = xxxEditor.posFromIndex(ar.op[j].p + ar.op[j].i.length);
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
				        	var userClass = firstOp.owner;
				        	var toPos = new Object();
				        	toPos.line = pos.line;
				        	toPos.ch = pos.ch + firstOp.i.length;
				            xxxEditor.doc.replaceRange(firstOp.i, pos);
				            var mark = xxxEditor.doc.markText(pos, toPos, {className:userClass});
				        } else if (firstOp.hasOwnProperty("d")) {
				            var toPos = xxxEditor.posFromIndex(firstOp.p + firstOp.d.length);
				            xxxEditor.doc.replaceRange("", pos, toPos)
				        }
				    }
				};
			}
		})
	}
});