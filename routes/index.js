var account = require('./account'),
    snippet = require('./snippet');    



module.exports = function(app) {  
  
  function requireAuthentication(req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    } else {
      return next();
    }
  };

  // app.all('/snippet/*', requireAuthentication);
  // app.all('/snippet', requireAuthentication);
  
  app.get('/', function(req, res){
    res.render('index', { title: 'Jimbo' });
  });    
                    
  app.all('/login', account.login);                         
  app.get('/logout', account.logout);
  app.get('/snippet', snippet.newSnippet);
  app.all('/signup', account.signup);
  app.get('/snippetLoad', snippet.loadSnippet);  
  app.get('/user', account.user);
  app.get('/users/list', account.list);  
}         


