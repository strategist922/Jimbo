var hat = require("hat");
var mongoose = require("mongoose");

exports.show = function(req, res) {    
  snippetProvider = SnippetProvider.factory();
  if (req.url == "/snippet/list") {
    snippetProvider.findAll(req.session.user, function(error, result) {
      res.json(result);
    });
  } else {
    var project_name = req.query.name;
    if (project_name) {
      snippetProvider.findByName(project_name, function(error, result) {
        res.json(result);
      });
    } else {
      res.render("snippet/index");
    }
  }
};

function contains(value, array) {
    for(var i=0; i < array.length; i++) {
        if(array[i] === value) return i;
    }
    return -1;
}

exports.new = function(req, res) {        
  var project_name = req.body.pname;
  var users = req.body.users; 
  var sid = req.body.sid;
  if (users == null) users = [];
  if(contains(req.session.user.user, users) === -1) users.push(req.session.user.user);
  snippetProvider = snippetProvider.factory();
  snippetProvider.findByName(project_name, function(error, project) {    
    if (project) {
      console.log("error: duplicated");
      res.render("snippet/index", {
        error: "Duplicated Name"
      });
    } else {
      snippetProvider.save({
        name: project_name,
        creator: req.session.user.user,
        users: users,                    
        shareJSId: sid,                              
        created_on: new Date,
        last_modified_on: new Date
      }, function(error, project) {               
          res.render("snippet/index");          
      });
      res.render("snippet/index");
    }
  });
};

exports.share = function(req, res, next) {};