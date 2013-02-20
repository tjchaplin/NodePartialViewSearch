var   express = require('express')
      , http = require('http')
      , https = require('https')
      , path = require('path')
          , cons = require('consolidate')
    , dustln = require('dustjs-linkedin')
      , package = require('./package.json')
      , passport = require('passport')
     , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
      , util = require('util');

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = "";
var GOOGLE_CLIENT_SECRET = "";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



 passport.use('google', new OAuth2Strategy({
     authorizationURL: ' https://accounts.google.com/o/oauth2/auth',
     tokenURL: 'https://accounts.google.com/o/oauth2/token',
     clientID: '',
     clientSecret: '',
     callbackURL: 'http://localhost:3000/auth/google/callback'
   },
   function(accessToken, refreshToken, profile, done) {
     console.log('AccessToken:'+accessToken);
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
                       });
                       req.end();


                       req.on('error', function(e) {
                           console.error(e);
                       });


     done(null,accessToken )
   }
 ));



var app = express();
app.root = __dirname;

// configure Express
app.configure(function() {
    app.set('view engine', 'dust');
    app.set('views', app.root+'/views');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
        app.use(express.static(app.root+'/public', {redirect: false}));
});
     app.engine('dust', cons.dust);

app.get('/', function(req, res){
    console.log('user:'+JSON.stringify(req.user))
                if(req.user == undefined)
                    res.render('index',{title:app.get('name'),isAuthenticated:false});
                else
                {
                    res.render('index',{title:app.get('name'),user:req.user,isAuthenticated:true});
                }

});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'] }));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/provider/callback',
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));


// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('redirected')
     res.redirect('/');


  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}