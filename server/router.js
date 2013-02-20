module.exports = function(app,express,passport) {
    var https = require('https');

    app.get('/',function(req, response){
        console.log('Success:'+JSON.stringify(req.user));
        if(req.user == undefined)
            response.render('index',{title:app.get('name'),isAuthenticated:false});
        else
        {
            response.render('index',{title:app.get('name'),user:req.user,isAuthenticated:true});
        }
    });

   app.get('/user/:userName',function(req, response){
         var user = req.params.userName;
        console.log("Root User:"+user);
        ensureAuthenticated(req,response,function(){
                console.log(req.user);
                if(req.user == undefined)
                    response.render('index',{title:app.get('name'),isAuthenticated:false});
                else
                {
                    response.render('index',{title:app.get('name'),user:req.user,isAuthenticated:true});
                }
            });
    });

    app.get('/login',function(req, response){
        if(req.user == undefined)
            response.render('index',{title:app.get('name'),isAuthenticated:false});
        else
        {
            response.render('index',{title:app.get('name'),user:req.user,isAuthenticated:true});
        }
    });

    app.get('/productSearch',function(request, response){
            ensureAuthenticated(request,response,function(){
                var googleProductSearch = {};

                googleProductSearch.baseUrl = 'https://www.googleapis.com/shopping/search/v1/public/products';
                googleProductSearch.key = ''
                googleProductSearch.filters =[];
                googleProductSearch.url = googleProductSearch.baseUrl+'?'+googleProductSearch.key+'&country=US&alt=json';

                var req = https.get(googleProductSearch.baseUrl,  function(res) {
                    console.log("statusCode: ", res.statusCode);
                    console.log("headers: ", res.headers);

                    res.on('data', function(d) {
                        process.stdout.write(d);
                    });
                    response.render('index',{title:app.get('name'),user:req.user});
                });
                req.end();


                req.on('error', function(e) {
                    console.error(e);
                });
        });
    });

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve redirecting
    //   the user to google.com.  After authenticating, Google will redirect the
    //   user back to this application at /auth/google/return
    app.get('/auth/google',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        console.log('Success:'+JSON.stringify(req.user));
            if(req.user == undefined)
                res.render('index',{title:app.get('name'),isAuthenticated:false});
            else
            {
                res.render('index',{title:app.get('name'),user:req.user,isAuthenticated:true});
            }
      });

    // Google will redirect the user to this URL after authentication.  Finish
    // the process by verifying the assertion.  If valid, the user will be
    // logged in.  Otherwise, authentication has failed.
    app.get('/auth/google/return',
    passport.authenticate('google', { failureRedirect: '/login' }),
              function(req, res) {
            console.log('Success:'+JSON.stringify(req.user));
            if(req.user == undefined)
                res.render('index',{title:app.get('name'),isAuthenticated:false});
            else
            {
                res.render('index',{title:app.get('name'),user:req.user,isAuthenticated:true});
            }
      });

    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/auth/google')
    }
}
