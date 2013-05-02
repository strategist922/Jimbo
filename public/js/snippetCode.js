var layout = function() {
    var _height = document.documentElement.clientHeight - $(".navbar").height() - 50;
    $("#mainView").height(_height);
    $("#editorArea").height(_height);
    $("#previewArea").height(_height);
    $("#mainView").css("width", document.documentElement.clientWidth);
}

$(window).resize(function() {
    layout();
    if ( typeof myCodeMirror !== 'undefined')
        myCodeMirror.refresh();
});

var editors = {};

var editorInit = function(id, mode) {
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
        autoCloseBrackets : true
    });

    return _editor;
}
var initApp = function(id, mode) {
    changeEditorMode(id, mode, "js");
}
var changeEditorMode = function(id, mode, type) {
    var codemirror = editorInit(id, mode);
    codemirror.setOption("readOnly", "nocursor");    
    
    $(".CodeMirror-wrap").height($("#editorArea").height() - $(".nav.nav-tabs").height() - 1);
    var snippetId = window.location.hash.substring(1);    
    sessionStorage.setItem("snippetId", snippetId);    
    window.editor = codemirror;
    var docName = snippetId;
    //ShareJS
    sharejs.open(docName, "text", function(error, newDoc) {
        if (doc !== null) {
            doc.close();
            doc.detach_cm();
        }

        doc = newDoc;

        if (error) {
            console.error(error);
            return;
        }
        doc.attach_cm(editor);
        codemirror.setOption("readOnly", false);                        
    });
    
    if ($(".CodeMirror.CodeMirror-wrap").size() > 1) {
        $($(".CodeMirror.CodeMirror-wrap")[1]).remove();
    }
}

$(document).ready(function() {
    layout();
    var elem = document.getElementById("jsEditor");    
    initApp(elem, "text/javascript", "js");

    /*$(".nav-tabs>li").on('click', function(e) {
        var currentEditor = e.currentTarget.dataset["id"];
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
    });*/
});
