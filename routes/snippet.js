var hat = require("hat");
var mongoose = require("mongoose");

exports.createOrLoad = function(req, res) {
    res.render("snippet/index");
    /*snippetProvider = SnippetProvider.factory();

    var sid = req.params["id"];    
    if (sid) {
        snippetProvider.findBySID(sid, function(error, result) {            
            res.json(result);            
        });
    } else {
        
    }*/
};

function contains(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value)
            return i;
    }
    return -1;
}


exports.new = function(req, res) {
    /*var sid = req.params["id"];
    snippetProvider = snippetProvider.factory();
    snippetProvider.findBySID(sid, function(error, snippet) {
        if (snippet) {
            console.log("error: duplicated");
            res.render("snippet/index", {
                error : "Duplicated Name"
            });
        } else {
            snippetProvider.save({
                snippetId : sid,
                created_on : new Date,
                last_modified_on : new Date
            }, function(error, snippet) {
                res.render("snippet/index");
            });
            res.render("snippet/index");
        }
    });*/
   res.render("snippet/index");
};

exports.share = function(req, res, next) {
}; 