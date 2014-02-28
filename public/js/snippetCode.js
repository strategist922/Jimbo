var getURL = function(url, c) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status < 400) return c(null, xhr.responseText);
        var e = new Error(xhr.responseText || "No response");
        e.status = xhr.status;
        c(e);
    };
};

var layout = function() {
    var _height = document.documentElement.clientHeight - $(".navbar").height() - 90;
    $("#mainView").height(_height);
    $("#editorArea").height(_height);
    $("#previewArea").height(_height);
    $("#mainView").css("width", document.documentElement.clientWidth);
    $(".CodeMirror-wrap").height($("#editorArea").height() - $(".nav.nav-tabs").height() - 1);
    var _tabWidth = ($(".tab-content").width() - 10) / 4;
    $(".nav>li").width(_tabWidth);
    $(".chatInput>input").width($(".chatInput").width() - 10);
    $(".chatMessages").width($(".chatBox").width() - 20);
    $(".pin").css("left", $(".span6").width() / 2);
    var _penSize = $(".span6").width() * 0.8;
    var _penLeft = ($(".span6").width() * 0.2) / 2;
    $(".pen").width(_penSize).css("left", _penLeft);
    //$('.dropZone').width($(".tab-content").width() - 10);
    //$('.dropZone').height($(".tab-content").height() - 10);

    if (pIframe) {
        try {
            var jsonCode = "",
                cssCode = "",
                jsCode = "",
                htmlCode = "";
            if (editors.json)
                jsonCode = editors.json.getValue();
            if (editors.html)
                htmlCode = editors.html.getValue();
            if (editors.css)
                cssCode = editors.css.getValue();
            if (editors.js)
                jsCode = editors.js.getValue();

            $('body #Jimbo-main', $('iframe').contents()).html(htmlCode);
            $('#Jimbo-style', $('iframe').contents()).get(0).textContent = cssCode;
            pIframe.Jimbo.json = JSON.parse(jsonCode);
            pIframe.Jimbo.renderCode(jsCode);
        } catch (err) {
            console.log(err);
        } finally {

        }
    }
}

var csv2json = function(csv) {
    var titles = csv[0];
    var json = "{\n";

    for (var i = 1; i < csv.length; i++) {
        var rec = csv[i];
        json += '  "data' + i + '": {'
        for (var j = 0; j < rec.length; j++) {
            if (j != rec.length - 1)
                json += '"' + titles[j] + '": "' + rec[j] + '", '
            else
                json += '"' + titles[j] + '": "' + rec[j] + '"';
        }
        if (i != csv.length - 1)
            json += "},\n";
        else
            json += "}";
    }
    json += "\n}";
    return json;
}

var _randomColor = function() {
    var h = Math.floor(Math.random() * 360);
    var s = Math.random() * 0.4 + 0.5;
    var l = Math.random() * 0.6 + 0.3;
    var c = 'hsl(' + h + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';

    return c;
}

$(window).resize(function() {
    layout();
    var curEditor = null;
    if (currentTabGlobal) {
        var type = currentTabGlobal.substring(0, currentTabGlobal.length - 3);
        curEditor = editors[type];
    }
    if (curEditor)
        curEditor.refresh();
});

var libraries = {
    d3: {
        src: "http://d3js.org/d3.v3.min.js"
    },
    jquery: {
        src: "http://code.jquery.com/jquery-2.0.0.min.js"
    },
    raphael: {
        src: "https://raw.github.com/DmitryBaranovskiy/raphael/master/raphael.js"
    }
}

var addLibScriptTag = function(libs) {
    for (var i = 0; i < libs.length; i++) {

    }
};

window.editors = {};
window.collaborators = {
    "htmlTab": 0,
    "jsTab": 0,
    "cssTab": 0,
    "jsonTab": 0
};

var syncCollaborators = function(curTab, prevTab) {
    if (curTab != "no") {
        collaborators[curTab] = collaborators[curTab] + 1;
        $("li[data-id='" + curTab + "']>a>div.notifTab").text(collaborators[curTab]);
    }
    if (prevTab != "no") {
        collaborators[prevTab] = collaborators[prevTab] - 1;
        $("li[data-id='" + prevTab + "']>a>div.notifTab").text(collaborators[prevTab]);
    }
}
var createEditor = function(elem, mode, type) {
    CodeMirror.commands.autocomplete = function(cm) {
        if (mode === "text/html")
            CodeMirror.showHint(cm, CodeMirror.htmlHint);        
    };

    var onDnD = false;
    if (type === 'json')
        onDnD = true;

    var _editor = CodeMirror.fromTextArea(elem, {
        mode: mode,
        lineNumbers: true,
        dragDrop: onDnD,
        lineWrapping: true,        
        autoCloseTags: false,
        matchBrackets: false,
        autoCloseBrackets: false,
        theme: "solarized light"
    });
    _editor.jimboType = type;
    if (type === 'css' || type === 'js')
        Inlet(_editor);
    $(".slider").css('display', 'none');
    $(".picker").css('display', 'none');
    $(_editor.getWrapperElement()).attr("data-jimboType", type);
    _editor.setOption("readOnly", "nocursor");

    var ternServer;
    if(type == "js") {        
        getURL("http://ternjs.net/defs/ecma5.json", function(err, code) {
            if (err) throw new Error("Request for ecma5.json: " + err);
            ternServer = new CodeMirror.TernServer({
                defs: [JSON.parse(code)]
            });
            _editor.setOption("extraKeys", {
                "Ctrl-Space": function(cm) {
                    ternServer.complete(cm);
                },
                "Ctrl-I": function(cm) {
                    ternServer.showType(cm);
                },
                "Alt-.": function(cm) {
                    ternServer.jumpToDef(cm);
                },
                "Alt-,": function(cm) {
                    ternServer.jumpBack(cm);
                },
                "Ctrl-Q": function(cm) {
                    ternServer.rename(cm);
                }
            });
            _editor.on("cursorActivity", function(cm) {
                ternServer.updateArgHints(cm);
            });
        });
    }
    else {
        _editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});        
    }
    if (onDnD) {
        _editor.setOption("onDragEvent", function(cm, e) {
            return true;
        });
    }
    return _editor;
}

var dropZone;

var editorInit = function(elem, mode, type) {
    var _editor;
    if (type === 'html') {
        if (!editors.html) {
            _editor = createEditor(elem, mode, type);
            editors.html = _editor;
            setTimeout(function(){
                _editor.refresh();
            }, 10);
        } else {
            _editor = editors.html;
        }
    } else if (type === 'js') {
        if (!editors.js) {
            _editor = createEditor(elem, mode, type);
            //_editor.setOption("lintWith", CodeMirror.javascriptValidator);
            _editor.setOption("gutters", [ /*"CodeMirror-lint-markers",*/ "CodeMirror-remote-change"]);
            editors.js = _editor;
            _editor.refresh();
        } else {
            _editor = editors.js;
        }
    } else if (type === 'css') {
        if (!editors.css) {
            _editor = createEditor(elem, mode, type);
            editors.css = _editor;
            _editor.refresh();
        } else {
            _editor = editors.css;
        }
    } else {
        if (!editors.json) {
            _editor = createEditor(elem, mode, type);
            //_editor.setOption("lintWith", CodeMirror.jsonValidator);
            //_editor.setOption("gutters", ["CodeMirror-lint-markers"]);
            dropZone = document.querySelectorAll(".CodeMirror[data-jimbotype='json']")[0];
            dropZone.addEventListener('dragstart', handleDragStart, false);
            dropZone.addEventListener('dragover', handleDragOver, false);
            dropZone.addEventListener('dragleave', handleDragLeave, false);
            dropZone.addEventListener('drop', handleDrop, false);
            editors.json = _editor;
            _editor.refresh();
        } else {
            _editor = editors.json;
        }
    }
    return _editor;
}

    function shoutOut(cmdMsg) {
        //var s = cmd + "$" + msg;
        if (cmdMsg.cmd == "on") {
            var _content = communicationDoc.getText().split("$");
            var _square;
            for (var i = 1; i < _content.length - 1; i++) {
                var u = _content[i].split(".")[0];
                var c = _content[i].split(".")[1];
                var z = _content[i].split(".")[2];
                var zz = atob(z);
                _square = $("<div>").addClass("userSquare").css("background-color", c).attr("data-username", u).tooltip({
                    placement: "bottom",
                    title: u
                }).append($("<img>").attr("src", zz));
                $(".nav.pull-right").prepend(_square);
            }
        } else if (cmdMsg.cmd == "chTab") {
            syncCollaborators(cmdMsg.curTab, cmdMsg.prevTab);
            var _cols = communicationDoc.getText();
            var _here = _cols.indexOf("$");
            communicationDoc.del(0, _here);
            communicationDoc.insert(0, collaborators["htmlTab"] + "," + collaborators["jsTab"] + "," + collaborators["cssTab"] + "," + collaborators["jsonTab"]);
        } else if (cmdMsg.cmd == "chat") {
            //Add chat messages localy on left
            var lastChatUser = $(".chatMessages div.chatMessage:last-child").attr("data-uid");
            if (lastChatUser == cmdMsg.username) {
                var _body = $(".chatMessages div.chatMessage:last-child .chatMsg").html();
                _body = _body + "</br>" + cmdMsg.message;
                $(".chatMessages div.chatMessage:last-child .chatMsg").html(_body);
                $(".chatMessages")[0].scrollTop = $(".chatMessages")[0].scrollHeight;
            } else {
                var message = $("<div>").addClass("chatMessage").attr("data-uid", cmdMsg.username).append($("<div>").addClass("chatSender").css({
                    "background-color": cmdMsg.color
                }).tooltip({
                    title: cmdMsg.username,
                    placement: "right"
                }).html($("<img>").attr("src", cmdMsg.zodiac))).append($("<div>").addClass("chatMsg").html(cmdMsg.message));
                var separator = $("<div>").addClass("chatSeparator");
                $(".chatMessages").append(separator);
                $(".chatMessages").append(message);
                $(".chatMessages")[0].scrollTop = $(".chatMessages")[0].scrollHeight;
            }
        } else if (cmdMsg.cmd == "off") {
            //Remove user from file
            //break;
            var _cols = communicationDoc.getText();
            communicationDoc.del(0, communicationDoc.getText().length);
            var _u = cmdMsg.username;
            var _c = cmdMsg.color;
            var _z = cmdMsg.zodiac;
            var _u_c_z = _u + "." + _c + "." + _z + "$";
            var _newCols = _cols.replace(_u_c_z, "");
            communicationDoc.insert(0, _newCols);
            $(".userSquare[data-username='" + _u + "']").remove();
        }
        communicationDoc.shout(cmdMsg);
    }

var shoutHandler = function(cmdMsg) {
    var cmd = cmdMsg.cmd;
    var isPush = cmdMsg.isPush;
    var type;
    var _template = '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>';
    if (isPush) {
        switch (cmd) {
            case 'on':
                var _msg = cmdMsg.msg;
                var color = cmdMsg.color;
                var username = cmdMsg.username;
                var zodiac = cmdMsg.zodiac;

                var _square = $("<div>").addClass("userSquare").css("background-color", color).attr("data-username", username).tooltip({
                    placement: "bottom",
                    title: username
                }).append($("<img>").attr("src", zodiac));;

                $(".nav.pull-right").prepend(_square);
                type = 'success';
                _template = '<div class="noty_message"><div class="noty_icon" style="background:' + cmdMsg.color + '"><img src="' + cmdMsg.zodiac + '"></img></div><span class="noty_text" style="margin-left: 5px"></span><div class="noty_close"></div></div>';
                break;
            case 'eu':
                var _msg = msg;
                type = 'information';
                break;
            case 'es':
                var _msg = msg;
                type = 'warning';
                break;
            case 'off':
                var _msg = cmdMsg.msg;
                var color = cmdMsg.color;
                var username = cmdMsg.username;
                _template = '<div class="noty_message"><div class="noty_icon" style="background:' + cmdMsg.color + '"><img src="' + cmdMsg.zodiac + '"></img></div><span class="noty_text" style="margin-left: 5px"></span><div class="noty_close"></div></div>';
                $(".userSquare[data-username='" + username + "']").remove();
                type = 'error';
                break;
            case 'lock':
                type = 'information';
                break;
                break;
            default:
                type = "alert";
                break
        }
        noty({
            text: cmdMsg.msg,
            template: _template,
            type: type,
            dismissQueue: true,
            layout: 'bottomLeft',
            timeout: 2000,
            closeWith: ['button'],
            buttons: false
        });
    } else {
        switch (cmd) {
            case 'change':
                var _user = cmdMsg.user;
                var isAnimatingUp = false,
                    isAnimatingDown = false;
                if (!needAwareness || currentUser.username == _user.username)
                    return;
                var line = cmdMsg.where;
                var cType = cmdMsg.type;
                //console.log(cViewPort);
                var sameTab = (currentTabGlobal.substring(0, currentTabGlobal.length - 3) === cType);
                if (sameTab) {
                    if (cType != 'js' && !isWidgetOpen)
                        break;
                    var cViewPort = {};
                    var scrollInfo = editors[cType].getScrollInfo();
                    cViewPort.from = editors[cType].coordsChar({
                        top: scrollInfo.top,
                        left: 0
                    }, "local").line;
                    cViewPort.to = editors[cType].coordsChar({
                        top: scrollInfo.clientHeight,
                        left: 0
                    }, "local").line;

                    if (cViewPort.from <= line && cViewPort.to >= line) {
                        //In editor                                     
                        if ($("style[data-id='" + _user.username + "']").length > 0) $("style[data-id='" + _user.username + "']").remove();
                        $("<style type='text/css' data-id='" + _user.username + "'> .remoteChange-line-" + _user.username + "{ background: #FFFF66;} </style>").appendTo("head");
                        var from = {
                            line: line,
                            ch: 0
                        };
                        var to = {
                            line: line,
                            ch: editors[cType].doc.getLine(line).length
                        };
                        var cMarker = editors[cType].markText(from, to, {
                            className: "remoteChange-line-" + _user.username
                        });
                        var cGutterMarker = $("<div>").addClass('gutterIcon').css("background-color", _user.color).append($("<img>").attr("src", _user.zodiac));
                        editors[cType].setGutterMarker(line, "CodeMirror-remote-change", cGutterMarker.get(0));
                        //In gutter
                        setTimeout(function() {
                            cMarker.clear();
                            editors[cType].clearGutter("CodeMirror-remote-change");
                        }, 1500);

                    } else if (cViewPort.from > line) {
                        if (isAnimatingUp)
                            return;
                        $(".gutterIconUp").fadeIn(500);
                        setTimeout(function() {
                            $(".gutterIconUp").fadeOut("slow");
                            isAnimatingUp = false;
                        }, 3000);
                    } else {
                        if (isAnimatingDown)
                            return;
                        $(".gutterIconDown").fadeIn(500);
                        setTimeout(function() {
                            $(".gutterIconDown").fadeOut("slow");
                            isAnimatingDown = false;
                        }, 3000);
                    }
                } else {
                    cTab = cType + "Tab";
                    var cTabObj = $("ul#editorTabs>li[data-id='" + cTab + "']>a");
                    cTabObj.css({
                        "background": "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(184,225,252,1)), color-stop(10%,rgba(169,210,243,1)), color-stop(25%,rgba(144,186,228,1)), color-stop(37%,rgba(144,188,234,1)), color-stop(50%,rgba(144,191,240,1)), color-stop(51%,rgba(107,168,229,1)), color-stop(83%,rgba(162,218,245,1)), color-stop(100%,rgba(189,243,253,1)))"
                    });
                    setTimeout(function() {
                        cTabObj.css({
                            "background": "none"
                        });
                    }, 5000);
                }
                break;
            case 'chat':
                var _username = cmdMsg.username;
                var _msg = cmdMsg.message;
                var _color = cmdMsg.color;
                var _zodiac = cmdMsg.zodiac;

                var lastChatUser = $(".chatMessages div.chatMessage:last-child").attr("data-uid");
                if (lastChatUser == cmdMsg.username) {
                    var _body = $(".chatMessages div.chatMessage:last-child .chatMsg").html();
                    _body = _body + "</br>" + cmdMsg.message;
                    $(".chatMessages div.chatMessage:last-child .chatMsg").html(_body);
                    $(".chatMessages")[0].scrollTop = $(".chatMessages")[0].scrollHeight;
                } else {
                    var message = $("<div>").addClass("chatMessage").attr("data-uid", _username).append($("<div>").addClass("chatSender").css({
                        "background-color": _color
                    }).tooltip({
                        title: _username,
                        placement: "right"
                    }).html($("<img>").attr("src", _zodiac))).append($("<div>").addClass("chatMsg").html(_msg));
                    var separator = $("<div>").addClass("chatSeparator");
                    $(".chatMessages").append(separator);
                    $(".chatMessages").append(message);
                    $(".chatMessages")[0].scrollTop = $(".chatMessages")[0].scrollHeight;
                }
                if ($(".chatBox").css("opacity") == 0 || $(".chatBox").css("display") == "none") {
                    var unreadMsgs = parseInt($(".notification.badge.badge-warning").text());
                    $(".notification.badge.badge-warning").text(unreadMsgs + 1);
                }
                break;
            case 'buzz':

                break;
            case 'chTab':
                curEditor = cmdMsg.curTab;
                preEditor = cmdMsg.prevTab;

                syncCollaborators(curEditor, preEditor);
                break;
        }
    }
}

window.SnippetCode = null;

window.pIframe = document.getElementById('previewFrame').contentWindow;

var loadSnippet = function(snippetId) {
    var snippetCodeObj = {};
    var url = "/doc/" + snippetId + "-";
    var iter = 0;
    var modes = ["html", "json", "css", "js"];
    var req = [];

    req[0] = $.get(url + "html", function(data) {
        snippetCodeObj.html = data;
    });
    req[1] = $.get(url + "js", function(data) {
        snippetCodeObj.js = data;
    });
    req[2] = $.get(url + "css", function(data) {
        snippetCodeObj.css = data;
    });
    req[3] = $.get(url + "json", function(data) {
        snippetCodeObj.json = data;
    });

    $.when(req[0], req[1], req[2], req[3]).done(function() {
        SnippetCode = snippetCodeObj;

        for (var p = 0; p < modes.length; p++) {
            var prop = modes[p];
            var code = SnippetCode[prop];
            if (code === null) {
                if (SnippetCode.js !== null)
                    pIframe.Jimbo.renderCode(SnippetCode.js);
                continue;
            }
            switch (prop) {
                case 'html':
                    $('body #Jimbo-main', $('iframe').contents()).html(code);
                    break;
                case 'js':
                    pIframe.Jimbo.renderCode(code);
                    break;
                case 'css':
                    $('#Jimbo-style', $('iframe').contents()).get(0).textContent = code;
                    //$('body #Jimbo-main', $('iframe').contents()).html(SnippetCode.html);
                    //pIframe.Jimbo.renderCode(SnippetCode.js);
                    break;
                case 'json':
                    try {
                        pIframe.Jimbo.json = JSON.parse(code);
                        //$('body #Jimbo-main', $('iframe').contents()).html(SnippetCode.html);
                        //$('#Jimbo-style', $('iframe').contents()).get(0).textContent = SnippetCode.css;
                        //pIframe.Jimbo.renderCode(SnippetCode.js);
                    } catch (err) {
                        console.log(err);
                    } finally {

                    }
                    break;
            }
        }
    });
};

var initializePreview = function() {
    var snippetId = sessionStorage["snippetId"];
    loadSnippet(snippetId);
};

var inletChange = function(token) {
    if(!isNaN(parseInt(token, 10)) || token.match(/#+(([a-fA-F0-9]){3}){1,2}/) != null)
        return true;
    return false;
}

var setupLivePreview = function() {
    //Html
    editors.html.on("beforeChange", function(cm, cObj) {
        cObj.cType = "html";
        if(typeof cObj.origin != "undefined"){
            awareOthers(editors.html, cObj);
        }
    });
    editors.html.on("change", function(cm, cObj) {
        var code = cm.getValue();
        $('body #Jimbo-main', $('iframe').contents()).html(code);
        if (editors.css)
            $('#Jimbo-style', $('iframe').contents()).get(0).textContent = editors.css.getValue();
        if (editors.json && editors.json.getValue() != "")
            try {
                pIframe.Jimbo.json = JSON.parse(editors.json.getValue());
        } catch (e) {

        }
        if (editors.js)
            pIframe.Jimbo.renderCode(editors.js.getValue());
    });

    //Javascript
    var changes = {};
    editors.js.on("beforeChange", function(cm, cObj) {
        cObj.cType = "js";
        if(typeof cObj.origin != "undefined"){
            awareOthers(editors.js, cObj);
        }
    });
    editors.js.on("change", function(cm, cObj) {
        var code = cm.getValue();
        $('body #Jimbo-main', $('iframe').contents()).html(editors.html.getValue());
        if (editors.css)
            $('#Jimbo-style', $('iframe').contents()).get(0).textContent = editors.css.getValue();
        if (editors.json && editors.json.getValue() != "")
            try {
                pIframe.Jimbo.json = JSON.parse(editors.json.getValue());
        } catch (e) {

        }
        pIframe.Jimbo.renderCode(code);
    });

    //Css
    editors.css.on("beforeChange", function(cm, cObj) {
        cObj.cType = "css";
        if(typeof cObj.origin != "undefined"){
            awareOthers(editors.css, cObj);
        }
    });
    editors.css.on("change", function(cm, cObj) {
        var code = cm.getValue();
        $('body #Jimbo-main', $('iframe').contents()).html(editors.html.getValue());
        $('#Jimbo-style', $('iframe').contents()).get(0).textContent = code;
        if (editors.json && editors.json.getValue() != "")
            try {
                pIframe.Jimbo.json = JSON.parse(editors.json.getValue());
        } catch (e) {

        }
        if (editors.js)
            pIframe.Jimbo.renderCode(editors.js.getValue());
    });

    //Json
    editors.json.on("change", function(cm, cObj) {
        var code = cm.getValue();
        try {
            pIframe.Jimbo.json = JSON.parse(code);
            $('body #Jimbo-main', $('iframe').contents()).html(editors.html.getValue());
            if (editors.css)
                $('#Jimbo-style', $('iframe').contents()).get(0).textContent = editors.css.getValue();
            if (editors.js)
                pIframe.Jimbo.renderCode(editors.js.getValue());
        } catch (err) {
            console.log(err);
        } finally {

        }
    });
}

var con;

function initCommunication() {
    window.needAwareness = true;
    var snippetId = sessionStorage["snippetId"];
    var connection = sharejs.open(snippetId, "text", function(error, comDoc) {
        if (error) {
            console.log("communication " + error);
            return;
        }
        communicationDoc = comDoc;
        if(communicationDoc.getText().indexOf(currentUser.username) > 0) {
            window.location.href = "/oops";
            window.reason = "oops";
            return
        }

        var _collaborators = communicationDoc.getText();
        var _here = _collaborators.indexOf("$");
        communicationDoc.del(0, _here);
        var userAvatar = btoa(currentUser.zodiac);
        communicationDoc.insert(communicationDoc.getText().length, currentUser.username + "." + currentUser.color + "." + userAvatar + "$");

        if (_collaborators.length == 0) {
            //First time access
            communicationDoc.insert(0, 1 + "," + collaborators["jsTab"] + "," + collaborators["cssTab"] + "," + collaborators["jsonTab"] + "$");
        } else {
            //Joined an existing snippet
            var _numC = _collaborators.split("$")[0];
            collaborators["htmlTab"] = parseInt(_numC.split(",")[0]);
            $("li[data-id='htmlTab']>a>div.notifTab").text(collaborators["htmlTab"]);
            collaborators["jsTab"] = parseInt(_numC.split(",")[1]);
            $("li[data-id='jsTab']>a>div.notifTab").text(collaborators["jsTab"]);
            collaborators["cssTab"] = parseInt(_numC.split(",")[2]);
            $("li[data-id='cssTab']>a>div.notifTab").text(collaborators["cssTab"]);
            collaborators["jsonTab"] = parseInt(_numC.split(",")[3]);
            $("li[data-id='jsonTab']>a>div.notifTab").text(collaborators["jsonTab"]);
        }

        communicationDoc.on('shout', function(s) {
            shoutHandler(s);
        });

        var cmdMsg = {
            cmd: "on",
            msg: currentUser.username + " just joined your snippet!",
            zodiac: currentUser.zodiac,
            username: currentUser.username,
            color: currentUser.color,
            isPush: true
        };
        shoutOut(cmdMsg);

        cmdMsg = {
            cmd: "chTab",
            curTab: currentTabGlobal,
            prevTab: "no",
            isPush: false
        };
        shoutOut(cmdMsg);
        //alert("done! 2");

    });

    var status = document.getElementById("usernameBadge");

    var register = function(state, klass, text) {
        connection.on(state, function() {
            status.className = 'label label-' + klass;
        });
    };
    register('ok', 'success', 'Online');
    register('disconnected', 'important', 'Offline');
    register('stopped', 'important', 'Error');

    $("#snippetnameBadge").tooltip({
        placement: "bottom",
        title: "Snippet Name"
    });
}

var _randomUsername = function(userId) {
    if (userId == undefined)
        userId = "Anonymous";
    return userId + Math.floor(Math.random() * 10001);
}
var _zodiacSigns = ["Aquarius", "Aries", "Cancer", "Capricorn", "Gemini", "Libra", "Lion", "Pisces", "Sagittarius", "Scorpio", "Taurus", "Virgo"];
var _randomZodiac = function() {
    var index = Math.floor((Math.random() * 1719) % 12);
    return _zodiacSigns[index];
}
var initApp = function() {    
    window.currentUser = {};
    currentUser.color = _randomColor();
    currentUser.zodiac = $("#usernameBadge").attr("data-avatar");
    currentUser.username = $("#usernameBadge").attr("data-username");

    var snippetId = window.location.hash.substring(1);
    sessionStorage.setItem("snippetId", snippetId);

    //Initialize Editors    
    var elem = document.getElementById("jsEditor");
    createEditorMode(elem, "text/javascript", "js");
    elem = document.getElementById("cssEditor");
    createEditorMode(elem, "text/css", "css");
    elem = document.getElementById("jsonEditor");
    var _mode = {
        name: "javascript",
        json: true
    };
    createEditorMode(elem, _mode, "json");

    var elem = document.getElementById("htmlEditor");
    createEditorMode(elem, "text/html", "html");

    $("#shareButton").tooltip({
        placement: "bottom",
        title: "Share your snippet!"
    });
    $("#editNameButton").tooltip({
        placement: "bottom",
        title: "Edit your snippet name!"
    });
    $("#editUsernameButton").tooltip({
        placement: "bottom",
        title: "Edit you name!"
    });

    currentTabGlobal = "htmlTab";

    var _num = $("li[data-id='" + currentTabGlobal + "']>a>div.notifTab").text();
    var _incNum = parseInt(_num, 10) + 1;
    $("li[data-id='" + currentTabGlobal + "']>a>div.notifTab").text(_incNum);
}
//TODO: Initializing user awareness
var awareOthers = function(cm, cObj) {
    var cmdMsg = {
        cmd: "change",
        where: cObj.from.line,
        type: cObj.cType,
        user: currentUser,
        isPush: false
    };
    shoutOut(cmdMsg);
}
var docs = {
    "html": null,
    "js": null,
    "css": null,
    "json": null
};
var currentDoc = null;

var communicationDoc = null;
var createEditorMode = function(elem, mode, type) {
    var codemirror = editorInit(elem, mode, type);
    $(".CodeMirror-wrap[data-jimboType='" + type + "']").height($("#editorArea").height() - $(".nav.nav-tabs").height() - 1);
    var snippetId = sessionStorage.getItem("snippetId");
    var docName = snippetId + "-" + type;

    sharejs.open(docName, "text", function(error, newDoc) {
        var idx = newDoc.name.split("-");
        var jType = idx[idx.length - 1];
        var _edtr = editors[jType];
        if(jType != "json")
            $(".CodeMirror[data-jimbotype='" + jType + "']").append("<a target='_blank' href='reviewCode#" + newDoc.name + "' class='btn btn-default btn-review'><i class='icon-eye-open'></i> Rewind</a>");
        if(!currentUser[newDoc.connection.id]){
            currentUser[newDoc.connection.id] = currentUser.username;
            sessionStorage.setItem("userObj", JSON.stringify(currentUser));
        }

        // if (currentDoc !== null) {
        // currentDoc.close();
        // currentDoc.detach_cm();
        // }

        //currentDoc = newDoc;
        docs[jType] = newDoc;

        if (error) {
            console.error(error);
            return;
        }

        newDoc.attach_cm(_edtr);
        _edtr.setOption("readOnly", false);

        if (_isReady()) {
            initCommunication();
            //Initialize Preview
            initializePreview();
            setupLivePreview();
            $(".loading-panel").hide();
            $(".container-fluid").removeClass("hidden");
            //alert("done! 1");                        
            //myCodeMirror = editors.html;
        }
    });
}
var _isReady = function() {
    if (docs.html !== null && docs.js !== null && docs.css !== null && docs.json !== null)
        return true;
    return false;
}
var changeEditorMode = function(type) {
    var snippetId = sessionStorage.getItem("snippetId");
    var docName = snippetId + "-" + type;

    window.myCodeMirror = editors[type];
    myCodeMirror.setOption("readOnly", "nocursor");

    //ShareJS
    sharejs.open(docName, "text", function(error, newDoc) {
        var idx = newDoc.name.split("-");
        var jType = idx[idx.length - 1];
        var _edtr = editors[jType];

        if (currentDoc !== null) {
            currentDoc.close();
            currentDoc.detach_cm();
        }

        currentDoc = newDoc;

        if (error) {
            console.error(error);
            return;
        }
        currentDoc.attach_cm(myCodeMirror);
        myCodeMirror.setOption("readOnly", false);
    });
}

window.onload = function() {
    $(".loading-panel").show();
    layout();
    initApp();
}

window.onbeforeunload = function(e) {
    if(window.reason != "oops") {
        var cmdMsg;
        if (communicationDoc !== null) {
            cmdMsg = {
                cmd: "off",
                msg: currentUser.username + " just left your snippet!",
                zodiac: currentUser.zodiac,
                username: currentUser.username,
                color: currentUser.color,
                isPush: true
            };
            shoutOut(cmdMsg);
            //communicationDoc.close();
            cmdMsg = {
                cmd: "chTab",
                curTab: "no",
                prevTab: currentTabGlobal,
                isPush: false
            };
            shoutOut(cmdMsg);
        }
    }
}
var currentTabGlobal = "";

var handleDragStart = function(e) {

}

var handleDragOver = function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).addClass("dropZone").css("opacity", "1");
}

var handleDragLeave = function(e) {
    $(dropZone).removeClass("dropZone").css("opacity", "1");
}

var handleDrop = function(e) {
    e.stopPropagation();
    e.preventDefault();

    editors.json.setOption('readOnly', 'nocursor');

    var files = e.dataTransfer.files;
    if (files[0].type != "text/csv" && files[0].type != "application/json" && files[0].type != "text/tab-separated-values") {
        $(this).removeClass("dropZone").css("opacity", "1")
    } else {
        var json;
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                switch (theFile.type) {
                    case 'text/csv':
                        var _json = d3.csv.parseRows(e.target.result);
                        json = csv2json(_json);
                        break;
                    case 'application/json':
                        var _json = e.target.result;
                        json = _json;
                        //var json = json2json(_json);                                        
                        break;
                    case 'text/tab-separated-values':
                        var _json = d3.tsv.parseRows(e.target.result);
                        json = csv2json(_json);
                        break;
                }
                editors.json.setValue(json);
                editors.json.setOption('readOnly', false);
                $(dropZone).removeClass("dropZone").css("opacity", "1");
            }
        })(files[0]);
        reader.readAsText(files[0]);
    }
}

var _isChatOpen = false;

$(document).ready(function() {
    $(".nav-tabs>li").on('click', function(e) {
        var currentEditor = e.currentTarget.dataset["id"];
        if (currentTabGlobal === currentEditor) {
            return;
        }
        var cmdMsg = {
            cmd: "chTab",
            curTab: currentEditor,
            prevTab: currentTabGlobal,
            isPush: false
        };
        shoutOut(cmdMsg);
        currentTabGlobal = currentEditor;

        var type = currentEditor.substring(0, currentEditor.length - 3);
        setTimeout(function() {
            editors[type].refresh();
        }, 100);
        //changeEditorMode(currentEditor.substring(0, currentEditor.length - 3));
        //$('.dropZone').height($(".tab-content").height() - 10);
    });

    $("#chatHide").click(function() {
        $(".chatInput>input").hide();
        $(".chatBox").animate({
            display: 'toggle',
            bottom: [0, 'swing'],
            opacity: 0
        }, "slow");
        $(".chatIcon").fadeIn("slow");
    });

    var chatShake;

    setInterval(function() {
        var _numMsgs = parseInt($(".notification.badge.badge-warning").text());
        if (_numMsgs == 0) {
            clearInterval(chatShake);
            _isChatOpen = false;
        } else {
            if (!_isChatOpen) {
                _isChatOpen = true;
                chatShake = setInterval(function() {
                    var direction = ["up", "left", "right", "down"];
                    var gRand = Math.random() * 113;
                    var rand = Math.round(gRand % 4);
                    $(".notification.badge.badge-warning").effect("shake", {
                        distance: 10,
                        times: 3,
                        direction: direction[rand]
                    });
                }, 1000);
            }
        }
    }, 1000);

    $(".chatIcon").click(function() {
        $(".notification.badge.badge-warning").text(0);
        $(".chatInput>input").show();
        $(".chatBox").animate({
            display: 'toggle',
            bottom: [195, 'swing'],
            opacity: 1
        }, "slow");
        $(".chatInput>input").width($(".chatInput").width() - 10);
        $(".chatMessages").width($(".chatBox").width() - 20);
        $(this).fadeOut("slow", function() {});
        clearInterval(chatShake);
    });

    $(".chatInput>input").keyup(function(e) {
        if (e.which == 13 && !e.shiftKey) {
            var msg = $(this).val();
            $(this).val('');
            var cmdMsg = {
                cmd: "chat",
                zodiac: currentUser.zodiac,
                username: currentUser.username,
                color: currentUser.color,
                message: msg,
                isPush: false
            };
            shoutOut(cmdMsg);
        }
    })
    var shareSnippet = function() {
        var dialogHeader = "<button type='button' class='close' data-dismiss='modal'>×</button><p class='center'><i class='icon icon-user icon-orange'></i> Share Snippet via Email</p>";
        var dialogContent = '<input type="email" id="email" placeholder="Enter a valid email!" width="100%" required/>';

        var dialogFooter = $("<div>").append($("<button>").addClass("btn btn-info").text("Share").click(function() {
            //Send email with link inside
            $("#dialog").modal('hide');
        }).attr('type', 'submit')).append($("<button>").attr("data-dismiss", "modal").addClass("btn btn-primary").text("Cancel").css('margin', '5px 5px 6px'));

        $("#dialog>div.modal-header").html(dialogHeader);
        $("#dialog>div.modal-body").html(dialogContent);
        $("#dialog>div.modal-footer").html(dialogFooter);

        $("#dialog").modal("show");
    }

    $("#snippetnameBadge").editable({
        type: 'text',
        autotext: "never",
        name: "snippetnameBadge",
        placement: 'bottom',
        value: $("#snippetnameBadge").val()
    });

    //Share snippet via email
    $("a[data-action=shareButton]").click(function() {
        shareSnippet();
    });
});