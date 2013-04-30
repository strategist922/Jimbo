var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var logger = require('../modules/logger');
var snippetProvider = undefined;       

logger.debugLevel = 'info';

SnippetProvider = function(host, port) { 
  if (process.env.MONGOHQ_URL) { // connect to mongoHQ
    this.db = Db.connect(process.env.MONGOHQ_URL, {db: {auto_reconnect: true}, noOpen: true, uri_decode_auth: true});
    this.db.open(function(err, db) {
      if (err == null) {
        var regex = new RegExp("^mongo(?:db)?://(?:|([^@/]*)@)([^@/]*)(?:|/([^?]*)(?:|\\?([^?]*)))$");
        var match = process.env.MONGOHQ_URL.match(regex);
        var auth = match[1].split(':', 2);
        auth[0] = decodeURIComponent(auth[0]);
        auth[1] = decodeURIComponent(auth[1]);
        db.authenticate(auth[0], auth[1], function(err, success) {
          if (err) {
            console.error(err);
          } else {
            // worked >:O
          }
        });
      } else {
        console.error(err);
      }
    });
  } else {
    this.db= new Db('ArianDb', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){});     
  }
};        

SnippetProvider.prototype.getCollection= function(callback) {
  this.db.collection('snippets', function(error, snippet_collection) {
    if( error ) callback(error);
    else callback(null, snippet_collection);
  });
};

SnippetProvider.prototype.findAll = function(user, callback) {
    this.getCollection(function(error, snippet_collection) {
      if( error ) callback(error)
      else {
        snippet_collection.find().sort("created_on",1).toArray(function(error, results) {
          if( error ) callback(error) 
          else {             
            var _results = [];
            for(var i = 0 ; i < results.length ; i++) {
               var r = results[i];                                       
               if (r.creator == user.user) {
                 _results.push(r);
               } else {
                 for(var j = 0; j < r.users.length; j++){
                 	var  u = r.users[j];
                    if (u == user.user) {
                      _results.push(r);                      
                      break;
                    }
                 }
               }
            }
            
            callback(null, _results)
          }
        });
      }
    });
};

SnippetProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, snippet_collection) {
      if( error ) callback(error)
      else {
        snippet_collection.findOne({_id: snippet_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};
        
SnippetProvider.prototype.findByName = function(name, callback) {
    this.getCollection(function(error, snippet_collection) {
      if( error ) callback(error)
      else {
        snippet_collection.findOne({name: name}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};
    
SnippetProvider.prototype.new = function(name, data, callback) {
  this.getCollection(function(error, snippet_collection) {
    if (error) callback(error);
    else {                               
      snippet_collection.findOne({name: name}, function(error, result) {
        if (error) callback(error);
         var leaf = result.root;
         var obj = {};
         obj.name = data.name;
         obj.type = data.type;
         obj.created_on = new Date();
         obj.last_modified_on = new Date();
         if (data.paths.length > 1) {
           var i = 0;
           data.paths.shift();   
           leaf = leaf[data.paths[i]];
           i++;
           if (data.paths.length > 1) {
             for (var j=0; j < leaf.length; j++ ) { 
               if (leaf[j].name == data.paths[i] && leaf[j].type == 'folder') {
                 leaf = leaf[j].children;
                 j = 0;
                 i++;
               }
             }
           }  
           for ( var i=0; i < leaf.length; i++ ) {
            if (leaf[i] != null && leaf[i].name == data.name && leaf[i].type == data.type) {
              callback('duplicated file'); 
              return;
            }
           }
           if (data.type == 'file') {
             obj.shareJSId = data.shareJSId
           } else {
             obj.children = [];
           } 
           leaf.push(obj);
         }   else {   
           if (data.type == 'file') {
             obj.shareJSId = data.shareJSId
             leaf.files.push(obj); 
           } else {
             leaf[obj.name] = [];
           } 
         }
         snippet_collection.save(result);
      });
    }
  });
};                           
                  
SnippetProvider.prototype.delete = function(name, data, callback) {
  this.getCollection(function(err, snippet_collection) {
    if (err) callback(err)
    else {
      function removeElement(leaf) {
        for (var i=0; i < leaf.length; i++) {
          if (leaf[i] != null && leaf[i].name == data.paths[0] && leaf[i].type == data.type ) {
            leaf.splice(i,1);
            break;
          }
        }
      };
      snippet_collection.findOne({name: name}, function(error, result) {
        if (error) callback(error)
        else {
          var leaf = result.root;
          data.paths.shift();
          if (data.paths.length == 1) {
            if (data.type == 'folder') {
              logger.log('info', {info: 'inside'});
              removeElement(leaf);
            } else {
              logger.log('warn', {warn: leaf.files});
              removeElement(leaf.files);
            }
          } else {
            while (data.paths.length > 1) {
              leaf = leaf[data.paths[0]];
              data.paths.shift();  
            }
            removeElement(leaf);
          } 
        }
        logger.log('info', {info: leaf});
        snippet_collection.save(result);
      })
    }
  });
};                  
                                           
/**
 * Update snippet information
 * @public
 * @param {String} name snippet name as a key for query
 * @param {Object} data
 * @config {Array} paths The file|folder paths
 * @config {string} cur_name The new file|folder name
 * @config {string} new_name The new file|folder name
 * @config {string} last_modified_on The new date
 * @param {function} [callback] The customized function to handle error
 */

SnippetProvider.prototype.update = function(name, data, callback) {
   // db.snippets.update({name: 'test', 'root.html.name': 'index.html'}, {$set:{'root.html.$.name': 'test.html'}})
  this.getCollection(function(error, snippet_collection) {
     if (error) callback(error);
     else {
       snippet_collection.findOne({name: name}, function(error, result) {
         var leaf = result.root; 
         var target;
         for ( var i=0; i < data.paths.length; i++ ) { 
           leaf = leaf[data.paths[i]];
         }
         for ( var i=0; i < leaf.length; i++ ) {
           if (leaf[i].name == data.old_name && leaf[i].type == data.type) {
              target = leaf[i];
              break;
           }
         }
         target.name = data.new_name;
         snippet_collection.save(result);
       });       
     }
  });
};

SnippetProvider.prototype.save = function(snippets, callback) {
    this.getCollection(function(error, snippet_collection) {
      if( error ) callback(error);
      else {
        if( typeof(snippets.length)=="undefined")
          snippets = [snippets];

        for( var i =0;i< snippets.length;i++ ) {
          snippet = snippets[i]; 
          if (!snippet.name || !snippet.creator || typeof(snippet.users)=="undefined") { 
            callback(error);
          }
          snippet.created_on = new Date();
          snippet.last_modified_on = new Date();
        }

        snippet_collection.insert(snippets, function() {
          callback(null, snippets);
        });
      }
    });
};

SnippetProvider.factory = function(){
  if (!snippetProvider) {
    snippetProvider = new SnippetProvider('localhost', 27017);  
  }
   return snippetProvider;  
};

exports.SnippetProvider = SnippetProvider;