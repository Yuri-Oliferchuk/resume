import passport from 'passport';                            //add pasport
import LocalStrategy from 'passport-local';                 //add pasport-local lirary
import bcrypt from 'bcrypt';                                //add dcrypt
import {findByUsername, findById} from './db.js';           //connect file with user object 

//set default pasport LocalStrategy
passport.use(
    new LocalStrategy(function verify(username, password, done) {        
        findByUsername(username, async function (err, user) {        
          if (err) return done(err);
          if (!user) return done(null, false, { message: "No user found", statusCode: 1});
          password = await bcrypt.hash(password, user.salt);
          if (user.password != password) { 
                      return done(null, false, { message: "Wrong password", statusCode: 1}); }
          return done(null, user, { statusCode: 0 });
        });
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    findById(id, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  });