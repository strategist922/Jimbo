var snippet = require('./snippet');    



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
  app.get('/snippet', snippet.newSnippet);
  app.get('/reviewCode', snippet.reviewCode);
  app.all('/getOps/:id', snippet.getOps);
  app.get('/snippetLoad', snippet.loadSnippet);    
}         


