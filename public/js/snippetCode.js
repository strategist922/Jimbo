var layout = function() {
    var _height = document.documentElement.clientHeight - $(".navbar").height() - 90;
    $("#mainView").height(_height);
    $("#editorArea").height(_height);
    $("#previewArea").height(_height);
    $("#mainView").css("width", document.documentElement.clientWidth);
    $(".CodeMirror-wrap").height($("#editorArea").height() - $(".nav.nav-tabs").height() - 1);
}

$(window).resize(function() {
    layout();
    if ( typeof myCodeMirror !== 'undefined')
        myCodeMirror.refresh();
});

var libraries = {
    d3 : {
        src : "http://d3js.org/d3.v3.min.js"
    },
    jquery : {
        src : "http://code.jquery.com/jquery-2.0.0.min.js"
    },
    raphael : {
        src : "https://raw.github.com/DmitryBaranovskiy/raphael/master/raphael.js"
    }
}

var addLibScriptTag = function(libs) {
    for (var i = 0; i < libs.length; i++) {

    }
};

var editors = {};
var createEditor = function(id, mode) {
    CodeMirror.commands.autocomplete = function(cm) {
        if (mode === "text/html")
            CodeMirror.showHint(cm, CodeMirror.htmlHint);
        else if (mode === "text/javascript")
            CodeMirror.showHint(cm, CodeMirror.javascriptHint);
    };

    var _editor = CodeMirror.fromTextArea(id, {
        mode : mode,
        lineNumbers : true,
        lineWrapping : true,
        extraKeys : {
            "Ctrl-Space" : "autocomplete"
        },
        autoCloseTags : true,
        matchBrackets : true,
        autoCloseBrackets : true,
        theme : "solarized light"
    });

    Inlet(_editor);
    $(".slider").css('display', 'none');
    $(".picker").css('display', 'none');

    _editor.setOption("readOnly", "nocursor");

    return _editor;
}
var editorInit = function(id, mode, type) {
    var _editor;
    if (type === 'html') {
        if (!editors.html) {
            _editor = createEditor(id, mode);            
            editors.html = _editor;
        } else {
            _editor = editors.html;
        }
    } else if (type === 'js') {
        if (!editors.js) {
            _editor = createEditor(id, mode);
            //_editor.setOption("lintWith", CodeMirror.javascriptValidator);
            _editor.setOption("gutters", [/*"CodeMirror-lint-markers",*/ "CodeMirror-remote-change"]);
            editors.js = _editor;
        } else {
            _editor = editors.js;
        }
    } else if (type === 'css') {
        if (!editors.css) {
            _editor = createEditor(id, mode);            
            editors.css = _editor;
        } else {
            _editor = editors.css;
        }
    } else {
        if (!editors.json) {
            _editor = createEditor(id, mode);
            //_editor.setOption("lintWith", CodeMirror.jsonValidator);
            //_editor.setOption("gutters", ["CodeMirror-lint-markers"]);            
            editors.json = _editor;
        } else {
            _editor = editors.json;
        }
    }
    return _editor;
}
function shoutOut(cmd, msg) {
    var s = cmd + "$" + msg;
    communicationDoc.shout(s);
}

function shoutHandler(cmd, msg, isPush) {
    var type;
    if(isPush) {
        switch(cmd) {
            case 'on':
                type = 'success';
                break;
            case 'eu':
                type = 'information';
                break;
            case 'es':
                type = 'warning';
                break;
            case 'off':
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
            text : msg,
            template : '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
            type : type,
            dismissQueue : true,
            layout : 'bottomLeft',
            timeout : 2000,
            closeWith : ['button'],
            buttons : false
        });
    }
    else {
        switch(cmd) {
            case 'change':
            if(!needAwareness) return;            
            var line = parseInt(msg.split(".")[0]);
            var cType = msg.split(".")[1];
            if(cType != 'js' && !isWidgetOpen) break;
            var cViewPort = {};
            var scrollInfo = myCodeMirror.getScrollInfo();
            cViewPort.from = myCodeMirror.coordsChar({top:0, left:0},"local").line;
            cViewPort.to = myCodeMirror.coordsChar({top:scrollInfo.clientHeight, left:0},"local").line;
            //console.log(cViewPort);
            var sameTab = (currentTabGlobal.substring(0, currentTabGlobal.length - 3) === cType);
            if(sameTab) {
                if(cViewPort.from <= line && cViewPort.to >= line) {
                    //In editor                   
                    var from = {line: line, ch: 0};
                    var to = {line: line, ch: myCodeMirror.doc.getLine(line).length};                             
                    var cMarker = myCodeMirror.markText(from, to, {className: "remoteChange-line"});
                    var cGutterMarker = $("<div>").addClass('gutterIcon');
                    myCodeMirror.setGutterMarker(line, "CodeMirror-remote-change", cGutterMarker.get(0));
                    //In gutter                
                    setTimeout(function(){
                        cMarker.clear();           
                        myCodeMirror.clearGutter("CodeMirror-remote-change");                         
                    }, 1500);
                    
                                
                } else if (cViewPort.from > line) {
                    var cUp = setInterval(function(){
                        $(".gutterIconUp").toggle();                       
                    }, 200);
                    
                    setTimeout(function(){
                        clearInterval(cUp);
                        $(".gutterIconUp").hide();
                    }, 1500);                    
                } else {
                    var cDown = setInterval(function(){
                        $(".gutterIconDown").toggle();                       
                    }, 200);
                    
                    setTimeout(function(){
                        clearInterval(cDown);
                        $(".gutterIconDown").hide();
                    }, 3000);
                }
            } else {
                cTab = cType + "Tab";
                var cTabObj = $("ul#editorTabs>li[data-id='" + cTab + "']>a");
                cTabObj.css("background-image", "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(230,240,163,1)), color-stop(50%,rgba(210,230,56,1)), color-stop(51%,rgba(195,216,37,1)), color-stop(100%,rgba(219,240,67,1)))");
                setTimeout(function(){
                    cTabObj.css("background", "none");                    
                }, 1200);                                
            }
            break;
            case 'chat':
            
            break;
            case 'buzz':
            
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
    var modes = ["html", "css", "json", "js"];
    var req = [];

    req[0] = $.get(url + "html", function(data) {
        if (data.search('404') === -1)
            snippetCodeObj.html = data;
        else
            snippetCodeObj.modes[iter] = null;
    });
    req[1] = $.get(url + "js", function(data) {
        if (data.search('404') === -1)
            snippetCodeObj.js = data;
        else
            snippetCodeObj.js = null;
    });
    req[2] = $.get(url + "css", function(data) {
        if (data.search('404') === -1)
            snippetCodeObj.css = data;
        else
            snippetCodeObj.css = null;
    });
    req[3] = $.get(url + "json", function(data) {
        if (data.search('404') === -1)
            snippetCodeObj.json = data;
        else
            snippetCodeObj.json = null;
    });

    $.when(req[0], req[1], req[2], req[3]).done(function() {
        SnippetCode = snippetCodeObj;        

        for (var p = 0; p < modes.length; p++) {
            var prop = modes[p];
            var code = SnippetCode[prop];
            if (code === null) {
                if (SnippetCode.js !== null)
                    iframe.Jimbo.renderCode(SnippetCode.js);
                continue;
            }
            switch(prop) {
                case 'html':
                    $('body #Jimbo-main', $('iframe').contents()).html(code);
                    pIframe.Jimbo.renderCode(SnippetCode.js);
                    break;
                case 'js':
                    $('body #Jimbo-main', $('iframe').contents()).html(SnippetCode.html);
                    pIframe.Jimbo.renderCode(code);
                    break;
                case 'css':
                    $('#Jimbo-style', $('iframe').contents()).get(0).textContent = code;
                    $('body #Jimbo-main', $('iframe').contents()).html(SnippetCode.html);
                    pIframe.Jimbo.renderCode(SnippetCode.js);
                    break;
                case 'json':
                    try {
                        pIframe.Jimbo.json = JSON.parse(code);
                        $('body #Jimbo-main', $('iframe').contents()).html(SnippetCode.html);
                        pIframe.Jimbo.renderCode(SnippetCode.js);
                    } catch(err) {
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

function initCommunication() {
    window.needAwareness = true;
    var snippetId = sessionStorage["snippetId"];
    var connection = sharejs.open(snippetId, "text", function(error, comDoc) {
        if (error) {
            console.log("communication " + error);
            return;
        }

        communicationDoc = comDoc;

        communicationDoc.on('shout', function(s) {
            var s1 = s.split("$");
            var cmd = s1[0];
            var msg = s1[1];
            var isPush = (s1[2] === "0") ? true: false;

            shoutHandler(cmd, msg, isPush);
        });

        var message = (currentUser === null) ? "Someone just joined your snippet!" : currentUser + " just joined your snippet!$0";
        shoutOut("on$" + message);
    });

    var status = $("#usernameBadge").get(0);

    var register = function(state, klass, text) {
        connection.on(state, function() {
            status.className = 'label label-' + klass;
            $(status).tooltip({
                placement : "bottom",
                title : text
            });
        });
    };

    $("#snippetnameBadge").tooltip({
        placement : "bottom",
        title : "Snippet Name"
    });

    register('ok', 'success', 'Online');
    register('connecting', 'warning', 'Connecting...');
    register('disconnected', 'important', 'Offline');
    register('stopped', 'default', 'Error');

}

var initApp = function(id, mode) {
    var currentUser = null;
    window.currentUser = currentUser;

    //Initialize Editors
    changeEditorMode(id, mode, "html");
    initCommunication();

    $("#shareButton").tooltip({
        placement : "bottom",
        title : "Share your snippet!"
    });
    $("#editNameButton").tooltip({
        placement : "bottom",
        title : "Edit your snippet name!"
    });
    $("#editUsernameButton").tooltip({
        placement : "bottom",
        title : "Edit you name!"
    });

    //Initialize Preview
    initializePreview();

}

//TODO: Initializing user awareness
var awareOthers = function(cObj) {       
    var command = "change";
    
    var cursor = myCodeMirror.getCursor(true);    
                                
    var where = cObj.from.line;
    var msg = where + "." + cObj.cType + "$1";
    shoutOut(command, msg);                                          
}

var doc = null;
var communicationDoc = null;

var changeEditorMode = function(id, mode, type) {
    var codemirror = editorInit(id, mode, type);

    $(".CodeMirror-wrap").height($("#editorArea").height() - $(".nav.nav-tabs").height() - 1);

    var snippetId = window.location.hash.substring(1);
    sessionStorage.setItem("snippetId", snippetId);
    var docName = snippetId + "-" + type;

    window.myCodeMirror = codemirror;
    myCodeMirror.jimboType = type;
    //ShareJS
    var connection = sharejs.open(docName, "text", function(error, newDoc) {
        if (doc !== null) {
            doc.close();
            doc.detach_cm();
        }

        doc = newDoc;

        if (error) {
            console.error(error);
            return;
        }
        doc.attach_cm(myCodeMirror);
        myCodeMirror.setOption("readOnly", false);
               
        switch(myCodeMirror.jimboType){
            case 'html':
            myCodeMirror.on("beforeChange", function(cm, cObj){
                cObj.cType = "html";
                awareOthers(cObj);
            });
            myCodeMirror.on("change",function(cm, cObj){   
                var code = cm.getValue();
                $('body #Jimbo-main', $('iframe').contents()).html(code);
                if(editors.js)
                    pIframe.Jimbo.renderCode(editors.js.getValue());                                
            });
            break;
            case 'js':
            myCodeMirror.on("beforeChange", function(cm, cObj){
                cObj.cType = "js";
                awareOthers(cObj);
            });                        
            myCodeMirror.on("change", function(cm, cObj){
                var code = cm.getValue();
                $('body #Jimbo-main', $('iframe').contents()).html(editors.html.getValue());
                pIframe.Jimbo.renderCode(code);                                
            });            
            break;
            case 'css': 
            myCodeMirror.on("beforeChange", function(cm, cObj){
                cObj.cType = "css";
                awareOthers(cObj);
            });           
            myCodeMirror.on("change", function(cm, cObj){
                var code = cm.getValue();              
                $('#Jimbo-style', $('iframe').contents()).get(0).textContent = code;
                $('body #Jimbo-main', $('iframe').contents()).html(editors.html.getValue());
                if (editors.js)
                    pIframe.Jimbo.renderCode(editors.js.getValue());
            });
            break;
            case 'json':
            myCodeMirror.on("beforeChange", function(cm, cObj){
                cObj.cType = "json";
                awareOthers(cObj);
            });
            myCodeMirror.on("change", function(cm, cObj){
                var code = cm.getValue();
                try {
                    pIframe.Jimbo.json = JSON.parse(code);
                    $('body #Jimbo-main', $('iframe').contents()).html(editors.html.getValue());
                    if (editors.js)
                        pIframe.Jimbo.renderCode(editors.js.getValue());
                } catch(err) {
                    console.log(err);
                } finally {
            
                }                
            });
            break;
        }        
    });

    /*if ($(".CodeMirror.CodeMirror-wrap").size() > 1) {
     $($(".CodeMirror.CodeMirror-wrap")).remove();
     }*/
}

window.onload = function() {
    layout();
    var elem = document.getElementById("htmlEditor");
    initApp(elem, "text/html");
}

window.onbeforeunload = function() {
    if (communicationDoc !== null) {
        var message = (currentUser === null) ? "Someone just left your snippet!" : currentUser + " just left your snippet!$0";
        shoutOut("off$" + message);
        //communicationDoc.close();
    }
}
var currentTabGlobal = "";

$(document).ready(function() {

    $(".nav-tabs>li").on('click', function(e) {
        //TODO: *****super important***** to generate the editors at the beginning not on demand
        var currentEditor = e.currentTarget.dataset["id"];
        if (currentTabGlobal === currentEditor) {
            return;
        }
        currentTabGlobal = currentEditor;
        switch(currentEditor) {
            case 'htmlTab':
                var _id = document.getElementById("htmlEditor");
                var _mode = "text/html";
                changeEditorMode(_id, _mode, "html");
                break;
            case 'jsTab':
                var _id = document.getElementById("jsEditor");
                var _mode = "text/javascript";
                changeEditorMode(_id, _mode, "js");
                break;
            case 'cssTab':
                var _id = document.getElementById("cssEditor");
                var _mode = "text/css";
                changeEditorMode(_id, _mode, "css");
                break;
            case 'jsonTab':
                var _id = document.getElementById("jsonEditor");
                var _mode = {
                    name : "javascript",
                    json : true
                };
                changeEditorMode(_id, _mode, "json");
                break;
            default:
                break;
        }
    });
    
    $("#chatHide").click(function(){
        $(".chatBox").animate({bottom:'toggle', opacity: '0'},"slow");                
    });
    
    setInterval(function(){
        var direction = ["up", "left", "right", "down"];
        var gRand = Math.random() * 113;
        var rand = Math.round(gRand % 4);        
        $(".notification.badge.badge-warning").effect("shake", {distance: 10, times: 3, direction: direction[rand]});
    }, 5000);
        
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

    $("#usernameBadge").editable({
        type : 'text',
        name : "usernameBadge",
        placement : 'bottom',
        value : $("#usernameBadge").val()
    });

    $("#snippetnameBadge").editable({
        type : 'text',
        autotext : "never",
        name : "usernameBadge",
        placement : 'bottom',
        value : $("#snippetnameBadge").val()
    });

    //Share snippet via email
    $("a[data-action=shareButton]").click(function() {
        shareSnippet();
    });
});
