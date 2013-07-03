var SP = require('../models/snippetProvider-redis');

exports.newSnippet = function(req, res) {        
    res.render("snippet/index");
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

