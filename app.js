#!/usr/bin/env node

var express = require('express')
  , sharejs = require('share').server
  , exec = require('child_process').exec;

var app = express();
app.disable('quiet');

express.limit('10mb');
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('prject', __dirname + '/views/snippet');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());          
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'osu-dwiz-jimbo' }));
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({
    src: __dirname + '/public',
    compress: true
  }));
  app.use(express.static(__dirname + '/public'));
});
   
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

require('./routes/index')(app)

var options = {/*db: {type: 'redis'}*/}; // See docs for options. {type: 'redis'} to enable persistance.
  options.db = {type: 'redis'};
  options.auth = function(agent, action) {
  action.accept();
};

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach(app, options);
var server;

server = app.listen(1337);
console.log('Server running at http://127.0.0.1:1337/');