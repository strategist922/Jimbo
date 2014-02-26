var SP = require('../models/snippetProvider-redis');

var redis = require("redis"),
client = redis.createClient();
exports.newSnippet = function(req, res) {        
    res.render("snippet/index");
};

exports.reviewCode = function(req, res) {
    res.render("snippet/review");
};
exports.getOps = function(req, res) {
    var name = req.params.id;
    client.lrange("ShareJS:ops:" + name, 0, -1, function(err, data){
        if(!err)
            res.json({
                ops: data,
                error: null
            });
        else {
            res.json({
                ops: null,
                error: err
            });
        }
    })
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

