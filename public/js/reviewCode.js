var SPEED = 50;
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
		var zodiac = (user.zodiac != undefined)?$("<img>").attr("src", user.zodiac):$("<i>").addClass("icon icon-user");
		_square = $("<div>").addClass("userSquare").attr("data-username", user.username).tooltip({
            placement: "bottom",
            title: user.username
        }).append(zodiac).append($("<div>").css({"background":user.color, "height":"5px", "margin":"0 -1px"}));
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
	var cleanOps = function() {
		final = [];
		var tempIns = {ops:[]};
		var tempDel = {ops:[]};
		for(var i=0;i<ops.length;i++){
			var op = JSON.parse(ops[i]);
		 	if(op.op[0].hasOwnProperty("i")){
		   		tempIns.ops.push(op);
		   		for(var j=i+1;;j++){
		   			if(j >= ops.length){
		   				final.push(tempIns);
		   				break;
		   			}
		     		var opCon = JSON.parse(ops[j]);
		     		if(opCon.op[0].hasOwnProperty("i")){
		       			tempIns.ops.push(opCon);
		       			if(j == ops.length - 1){
		       				final.push(tempIns);
		       				tempIns = {ops:[]};
		       				i = j-1;
		       				break;
		       			}
		     		}
		     		else {
		       			final.push(tempIns);
		       			tempIns = {ops:[]};
		       			i = j-1;
		       			break;
		     		}
		   		}
		  	}
		  	else if(op.op[0].hasOwnProperty("d")){
		   		tempDel.ops.push(op);
		   		for(var j=i+1;;j++){
		   			if(j >= ops.length){
		   				final.push(tempIns);
		   				break;
		   			}
		     		var opCon = JSON.parse(ops[j]);
		     		if(opCon.op[0].hasOwnProperty("d")){
		       			tempDel.ops.push(opCon);
		       			if(j == ops.length - 1){
		       				final.push(tempDel);
			       			tempDel = {ops:[]};
			       			i = j-1;
			       			break;
		       			}
		     		}
		     		else {
		       			final.push(tempDel);
		       			tempDel = {ops:[]};
		       			i = j-1;
		       			break;
		     		}
		   		}
		  	}
		}
		return final;
	}

	var getOps = function(name) {
		$.ajax({
		  	type: "GET",
		  	url: "/getOps/" + name,
		  	success: function(data){
		  		if(!data.error){
		  			$(".loading-panel").hide();
		  			$(".container").removeClass("hidden");
		  			window.ops = data.ops;
		  			window.finalOps = cleanOps();
		  			$(".timelineSlider").slider({min:0, max: finalOps.length, step:1});
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
	    	var stepOps = finalOps[i];
	    	for(var j = 0 ; j < stepOps.ops.length; j++){
	    		ar = stepOps.ops[j];
			    if (ar.op.length > 1) {
			    	for(var k = 0; k < ar.op.length; k++){
			    		var pos = xxxEditor.posFromIndex(ar.op[k].p);
				    	if (ar.op[k].hasOwnProperty("i")) {
				    		var userClass = ar.op[k].owner;
				            xxxEditor.doc.replaceRange(ar.op[k].i, pos);
				            toPos = xxxEditor.posFromIndex(ar.op[k].p + ar.op[k].i.length);
			            	var mark = xxxEditor.doc.markText(pos, toPos, {className:userClass});
				        } else if (ar.op[k].hasOwnProperty("d")) {
				            toPos = xxxEditor.posFromIndex(ar.op[k].p + ar.op[k].d.length);
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
	    	}
	    	i = i + 1;
		    $(".timelineSlider").slider("value", i);
		    if (i < finalOps.length)
		        setTimeout(replayCode, SPEED * stepOps.ops.length);
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
			    	stepOps = finalOps[i];
			    	for(var j = 0 ; j < stepOps.ops.length; j++){
			    		ar = stepOps.ops[j];
					    if (ar.op.length > 1) {
					    	for(var k = 0; k < ar.op.length; k++){
					    		var pos = xxxEditor.posFromIndex(ar.op[k].p);
						    	if (ar.op[k].hasOwnProperty("i")) {
						    		var userClass = ar.op[k].owner;
						            xxxEditor.doc.replaceRange(ar.op[k].i, pos);
						            toPos = xxxEditor.posFromIndex(ar.op[k].p + ar.op[k].i.length);
					            	var mark = xxxEditor.doc.markText(pos, toPos, {className:userClass});
						        } else if (ar.op[k].hasOwnProperty("d")) {
						            toPos = xxxEditor.posFromIndex(ar.op[k].p + ar.op[k].d.length);
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
			    	}
				}
			}
		})
	}
});