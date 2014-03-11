var snippet = require('./snippet')
  , passport = require('passport')
  , btoa = require('btoa')
  , sharejs = require("share").client;


module.exports = function(app) {  
  function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.redirect('/redirect');
  }

  // app.all('/snippet/*', requireAuthentication);
  // app.all('/snippet', requireAuthentication);
  app.get('/', function(req, res){
    if(!req.user)
      res.render('login', { title: 'Jimbo - Login', user: req.user});
    else
      res.redirect('/home');
  });

  app.get('/oops', ensureAuthenticated, function(req, res){
    res.render('snippet/oops', { title: 'Dear ' + req.user.username + ', You are already in that snippet!', user: req.user});
  });

  app.get('/home', ensureAuthenticated, function(req, res){
    res.render('index', { title: 'Jimbo' , user: req.user});
  });

  app.get('/redirect', function(req, res){
      res.render('hashUrl', { user: req.user });
  });

  app.get('/login', function(req, res){
      req.session.retUrl = req.query.retUrl;
      res.render('login', { user: req.user });
  });

  app.all('/clean', function(req, res){
    var cmdMsg = req.cmdMsg;
    var color = cmdMsg.color;
    var username = cmdMsg.username;
    var _z = btoa(cmdMsg.zodiac);

    // sharejs.open(req.session.retUrl, "text", "http://localhost/channel", fucntion(error, doc){
    //   if(!error) {
    //     var _cols = doc.getText();
    //     doc.del(0, doc.getLength());
    //     var _u_c_z = username + "." + color + "." + _z + "$";
    //     var _newCols = _cols.replace(_u_c_z, "");
    //     communicationDoc.insert(0, _newCols);
    //   }
    // })

    req.session.retUrl = null;
    res.render('index', { title: 'Jimbo' , user: req.user});
  });

  app.all('/logout', function(req, res){
      req.logout();
      res.redirect('/');
  });

  app.get('/auth/github', passport.authenticate('github'), function(req, res){

  });

  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    if(req.session.retUrl)
      res.redirect('/snippet#' + req.session.retUrl);
    else
      res.redirect('/home');
  });

  app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/login');
  });

  app.get('/snippet', ensureAuthenticated, snippet.newSnippet);
  app.get('/reviewCode', ensureAuthenticated, snippet.reviewCode);
  app.all('/getOps/:id', ensureAuthenticated, snippet.getOps);
  app.get('/snippetLoad', ensureAuthenticated, snippet.loadSnippet);
}         


