var layout = function() {
    var _height = document.documentElement.clientHeight - $(".navbar").height() - 50;
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
        theme:"solarized light"                
    });
        
    _editor.setOption("readOnly", "nocursor");    
    
    return _editor;
}
var editorInit = function(id, mode, type) {
    var _editor;
    if(type === 'html'){
        if(!editors.html){
            _editor = createEditor(id, mode);
            editors.html = _editor;
        }
        else {
           _editor = editors.html;  
        }
    } else if(type === 'js') {
        if(!editors.js){
            _editor = createEditor(id, mode);
            editors.js = _editor;
        }
        else {
           _editor = editors.js;  
        }
    } else if(type === 'css') {
        if(!editors.css){
            _editor = createEditor(id, mode);
            editors.css = _editor;
        }
        else {
           _editor = editors.css;  
        }     
    } else {
        if(!editors.json){
            _editor = createEditor(id, mode);
            editors.json = _editor;
        }
        else {
           _editor = editors.json;  
        }     
    }    
    return _editor;       
}
var initApp = function(id, mode) {
    changeEditorMode(id, mode, "html");
    
    $("#shareButton").tooltip({placement:"bottom", title:"Share your snippet!"});
    $("#editNameButton").tooltip({placement:"bottom", title:"Edit your snippet name!"});
    $("#editUsernameButton").tooltip({placement:"bottom", title:"Edit you name!"});
    
    //TODO:Ask for name
}

var doc = null;

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
        console.log(doc.name)

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

var currentTabGlobal = "";

$(document).ready(function() {    
        
    $(".nav-tabs>li").on('click', function(e) {        
        var currentEditor = e.currentTarget.dataset["id"];
        if(currentTabGlobal === currentEditor) {            
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
});
