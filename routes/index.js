var snippet = require('./snippet')
  , passport = require('passport');


module.exports = function(app) {  
  function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.redirect('/redirect');
  }

  // app.all('/snippet/*', requireAuthentication);
  // app.all('/snippet', requireAuthentication);
  app.get('/', function(req, res){
    res.render('login', { title: 'Jimbo - Login', user: req.user});
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

  app.all('/logout', function(req, res){
      req.session.retUrl = null;
      req.logout();
      res.render('/');
  });

  app.get('/auth/github', passport.authenticate('github'), function(req, res){

  });

  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    console.log(req.user);
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


