#!/usr/bin/env node

var express = require('express')
  , sharejs = require('share').server
  , exec = require('child_process').exec
  , passport = require('passport')
  , util = require('util')
  , GitHubStrategy = require('passport-github').Strategy;

var GITHUB_CLIENT_ID = "4205dc2703361fad3d91";
var GITHUB_CLIENT_SECRET = "a1e9e46293ffe3cabc6413cff705a14e4e39b451";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://www.jimbojs.com/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
        return done(null, profile);
    });
  }
));

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
  app.use(passport.initialize());
  app.use(passport.session());
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

server = app.listen(80);
console.log('Server running at http://127.0.0.1:1337/');
