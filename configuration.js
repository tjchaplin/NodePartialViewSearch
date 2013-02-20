module.exports = function(app,express,passport,GoogleStrategy) {

    app.configure(function(){
        app.set('port', process.env.PORT || 3000);
        app.set('view engine', 'dust');
        app.set('views', app.root+'/views');
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({ secret: 'very_unique_secret_string',
            cookie: { maxAge: 1800000 }}));
        app.use(express.static(app.root+'/public', {redirect: false}));
    });

     // Passport session setup.
     //   To support persistent login sessions, Passport needs to be able to
     //   serialize users into and deserialize users out of the session.  Typically,
     //   this will be as simple as storing the user ID when serializing, and finding
     //   the user by ID when deserializing.  However, since this example does not
     //   have a database of user records, the complete Google profile is serialized
     //   and deserialized.
     passport.serializeUser(function(user, done) {
       done(null, user);
     });

     passport.deserializeUser(function(obj, done) {
       done(null, obj);
     });

      passport.use(new GoogleStrategy({
              returnURL: 'http://localhost:3000/auth/google/return',
              realm: 'http://localhost:3000'
          },

          function(identifier, profile, done) {
              console.log("identifier:"+identifier+" :");
              profile.identifier = identifier;
              return done(null, profile);
          }
      ));

}