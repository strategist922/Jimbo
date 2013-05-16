var hat = require("hat");
var SP = require('../models/snippetProvider-redis');

exports.newSnippet = function(req, res) {
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

exports.loadSnippet = function(req, res) {        
    var sId = req.body.snippetId;
    var type = "html";
    request(
        {
            uri: "/doc/" + sId + "-" + type,
            method: "GET"
        },
        function(err, response, body){
            console.log(response);        
        }        
    );
        
};

