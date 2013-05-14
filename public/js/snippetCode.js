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

function shoutHandler(cmd, msg) {
    var type;
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

function initCommunication() {
    var snippetId = sessionStorage["snippetId"];
    var connection = sharejs.open(snippetId, "text", function(error, comDoc) {
        if (error) {
            console.log("communication " + error);
            return;
        }

        communicationDoc = comDoc;

        communicationDoc.on('shout', function(s) {
            var cmd = s.split("$")[0];
            var msg = s.split("$")[1];

            shoutHandler(cmd, msg);
        });

        var message = (currentUser === null) ? "Someone just joined your snippet!" : currentUser + " just joined your snippet!";
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

    //TODO:Ask for name
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

window.onunload = function() {
    if (communicationDoc !== null) {
        var message = (currentUser === null) ? "Someone just left your snippet!" : currentUser + " just left your snippet!";
        shoutOut("off$" + message);
        //communicationDoc.close();
    }
}
var currentTabGlobal = "";

$(document).ready(function() {

    $(".nav-tabs>li").on('click', function(e) {
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
        name: "usernameBadge",
        placement: 'bottom',
        value : $("#usernameBadge").val()        
    });    
    
    $("#snippetnameBadge").editable({
        type : 'text',        
        autotext : "never",         
        name: "usernameBadge",
        placement: 'bottom',
        value : $("#snippetnameBadge").val()               
    });    
   
    //Share snippet via email
    $("a[data-action=shareButton]").click(function() {
        shareSnippet();
    });
});
