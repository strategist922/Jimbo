var shareServer = require('share').server;

exports.snippetCode = function(snippetId, callback) {
    var editorTypes = ["html", "js", "css", "json"];
    var codeObj = {};
    for(var i = 0; i < 3 ; i++) {
        sId_type = snippetId + "-" + editorTypes[i];
        app.model.getSnapshot(sId_type, function(err, data, dbMeta){
            if(err){
                codeObj.sId_type.split("-")[1] = null;
            }
            else {
                codeObj.sId_type.split("-")[1] = data;
            }            
        });                        
        callback(null, codeObj);        
    }
};

