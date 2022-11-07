const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");


function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        console.log(email, password);
        pool.query(
          `SELECT * FROM login_details WHERE email = $1`,
          [email],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
    
            if (results.rows.length > 0) {
              const user = results.rows[0];
    
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                  console.log(err);
                }
                if (isMatch) {
                  return done(null, user);
                } else {
                  //password is incorrect
                  return done(null, false, { message: "Password is incorrect" });
                }
              });
            } else {
              // No user
              return done(null, false, {
                message: "No user with that email address"
              });
            }
          }
        );
      };


    passport.use(
        new LocalStrategy(
          { usernameField: "email", passwordField: "password" },
          authenticateUser
        )
      );

      passport.serializeUser((user, done) => done(null, user.email));

      passport.deserializeUser((email, done) => {
        pool.query(`SELECT * FROM login_details WHERE email = $1`, [email], (err, results) => {
          if (err) {
            return done(err);
          }
          console.log(`Email is ${results.rows[0].email}`);
          return done(null, results.rows[0]);
        });
      });

}

module.exports = initialize;