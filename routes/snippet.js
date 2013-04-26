var hat = require("hat");
var mongoose = require("mongoose");
var OpenTok = require("opentok");
var CM = require('../models/contentprovider-mongodb');

exports.show = function(req, res) {    
  projectProvider = ProjectProvider.factory();
  if (req.url == "/project/list") {
    projectProvider.findAll(req.session.user, function(error, result) {
      res.json(result);
    });
  } else {
    var project_name = req.query.name;
    if (project_name) {
      projectProvider.findByName(project_name, function(error, result) {
        res.json(result);
      });
    } else {
      res.render("project/index");
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
  projectProvider = ProjectProvider.factory();
  projectProvider.findByName(project_name, function(error, project) {    
    if (project) {
      console.log("error: duplicated");
      res.render("project/index", {
        error: "Duplicated Name"
      });
    } else {
      projectProvider.save({
        name: project_name,
        creator: req.session.user.user,
        users: users,                    
        shareJSId: sid,                              
        created_on: new Date,
        last_modified_on: new Date
      }, function(error, project) {               
          res.render("project/index");          
      });
      res.render("project/index");
    }
  });
};

exports.files = {};
exports.chat = {};
exports.comment = {};
exports.lockedCode = {};
       
exports.share = function(req, res, next) {};

exports.getContent = function(req, res, next) {
    contentProvider = ContentProvider.factory();
                          
    var pname = req.params["name"];        
              
    projectProvider.findByName(pname, function(error, result) {
        var shareJSId = result.shareJSId;
        contentProvider.findLatest(shareJSId, req.session.user.user, function(error, result){
           if(error){                  
                res.send(404, {error:error});            
            }
            else{            
                res.send(200,{data:result});
            }      
        });        
    });
}

exports.saveXML = function(req, res, next) {
    contentProvider = ContentProvider.factory();             
    var snapshot = req.body.snapshot;
    var content = req.body.content;    
    var owner = req.body.owner;
    var timestamp = req.body.timestamp;
    var pname = req.params["name"];
    var sid = req.body.shareJSId;
    //TODO: Update project's last modified on
    
    var queryData = {"shareJSId": sid, "snapshot": snapshot, "contet": content, "timestamp": timestamp, "owner": owner, "project": pname};              
    contentProvider.newXML(queryData, function(error, cs){
        if(error){
            res.send(404, {
            error: error
          });            
        }        
        else {            
            res.send(200, {
                cs:cs
            });
        }        
    });        
};

exports.augmentMe = function(req, res, next) {    
    var pname = req.params['name'];    
    
    var retVal = {};
        
    var Comment = mongoose.model('Comment');
    var LockedCode = mongoose.model('LockedCode');
    var NotificationRequest = mongoose.model('NotificationRequest');
    Comment.find({commentPN: pname}, function(err, comments){        
        retVal.comments = comments;
        LockedCode.find({lockedCodePN: pname}, function(err, lockedCodes){            
            retVal.lockedCodes = lockedCodes;
            NotificationRequest.find({notificationRequestPN: pname}, function(err, notificationRequests){
                retVal.notificationRequests = notificationRequests;
                res.send(200, {comments: retVal.comments, lockedCodes: retVal.lockedCodes, notificationRequests: retVal.notificationRequests});
            })            
        });                              
    });  
}

var chat_rooms = {};

exports.chat.createRTCSession = function(req, res, next) {
    var api_key = req.body.api_key;
    var api_secret = req.body.api_secret;
    var pname = req.body.pname;    
        
    var opentok = new OpenTok.OpenTokSDK(api_key, api_secret);
    
    if(chat_rooms[pname]) {
        var token = opentok.generateToken({session_id:chat_rooms[pname], connection_data:"project:"+ pname +", user:" + req.session.user.user});
        res.send(200, {sessionId:chat_rooms[pname], token:token});        
    }
    else {    
        var location = "128.193.39.9:2727";
        var sessionId = '';
        opentok.createSession(location, function(result){
            sessionId = result;
            chat_rooms[pname] = sessionId;
            var token = opentok.generateToken({session_id:sessionId, connection_data:"project:"+ pname +", user:" + req.session.user.user});            
            res.send(200, {sessionId:sessionId, token:token});
        });
    }
    
}

exports.comment.updateLineNumber = function(req, res, next) {
    var newLine = req.body.lineNumber;
    var cid = req.params['id'];
    
    //mongoose.connect('mongodb://localhost/collabcoding');
    var Comment = mongoose.model('Comment');
    Comment.findOneAndUpdate({commentId: cid}, {$set:{commentLineNumber: newLine}}, function(){res.send(200);});    
}

exports.lockedCode.updateLineNumber = function(req, res, next) {    
    var newFrom = req.body.from;
    var newTo = req.body.to;
    var lcid = req.params['id'];
    
    //mongoose.connect('mongodb://localhost/collabcoding');
    var LockedCode = mongoose.model('LockedCode');
    LockedCode.findOneAndUpdate({lockedCodeId: lcid}, {$set:{lockedCodeFrom: newFrom, lockedCodeTo: newTo}}, function(){res.send(200);});
}

// exports.files.findContent = function(req, res, next) {
//   var shareJSId = req.params["id"];
//   CM.findByshareJSId(shareJSId, function(error, result){
//     res.json(result);
//   });
// };
// 
// 
// exports.syncToMongo = function(req, res, next) {
//   var shareJSId = req.body.shareJSId;
//   var content = req.body.content;
//   var timestamp = req.body.timestamp;
//   CM.save({shareJSId: shareJSId, content: content, timestamp: timestamp}, function(e, r){
//     console.log(e, r);
//     next(); 
//   });
// }
