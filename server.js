const express = require('express');
const app = express();
const {pool} = require('./dbConfig');
const bcrypt = require('bcrypt');
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");

const initializePassport = require("./passportConfig");

initializePassport(passport);

const PORT = process.env.PORT || 4000;

app.set('view engine', "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
app.use(
    session({
      // Key we want to keep secret which will encrypt all of our information
      secret: 'secret',
      // Should we resave our session variables if nothing has changes which we dont
      resave: false,
      // Save empty value if there is no vaue which we do not want to do
      saveUninitialized: false
    })
  );
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

app.get('/',(req,res) => {
    res.render('index');
});

app.get('/users/register',checkAuthenticated,(req,res) => {
    res.render('register');
});

app.get('/users/login',checkAuthenticated,(req,res) => {
    res.render('login');
});

app.get('/users/dashboard',checkNotAuthenticated,(req,res) => {

    res.render('dashboard',{user: req.user.First_name});
});

app.get("/users/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.render("login", { message: "You have logged out successfully" });
      });

  });

app.post('/users/register',async (req,res) => {
    let {fname,lname,email,password,password2,street,city,state,country,userType} = req.body;
    console.log({fname,lname,email,password,password2,street,city,state,country,userType});

    let errors=[];

    if(!fname ||!lname || !email || !password || !password2){
        errors.push({message: "Please enter all fields"});
    }
    if(password.length < 6){
        errors.push({message: "Password must be at least 6 characters"});
    }
    if(password!=password2){
        errors.push({message: "Passwords do not match"});
    }
    if(errors.length>0){
        res.render('register',{errors});
    }
    else {
        let hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM login_details
            WHERE email=$1`, [email], (err,results)=>{
                if(err) throw err;
                console.log(results.rows);
                if (results.rows.length > 0) {
                    errors.push({
                        message: "Email already registered"
                      });
                    return res.render("register", {errors});
                  }
                  else {
                    pool.query(
                        `INSERT INTO login_details
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                        RETURNING email`,
                        [email,fname,lname,hashedPassword,street,city,state,country,userType],
                        (err,results)=>{
                            if(err) throw err;
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/users/login");
                        }
                    )
                  }
            }
        )


    }
});

app.post(
    "/users/login",
    passport.authenticate("local", {
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true
    })
  );

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/users/dashboard");
    }
    next();
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  }

// Dashboard to Search
app.get('/users/search',(req,res) => {
    res.render('search.ejs');
});

app.get('/users/dashboard',(req,res) => {
    res.render('dashboard.ejs');
});

//
app.post('/users/query', function(req,res){
    var s=req.body.speciality;
    var t=req.body.type;
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      if(s==1 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Event Planner' AND sp_speciality='Catering'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==1 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Vendor' AND sp_speciality='Catering'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==2 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Event Planner' AND sp_speciality='Tenting'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==2 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Vendor' AND sp_speciality='Tenting'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==3 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Event Planner' AND sp_speciality='Transportation'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==3 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Vendor' AND sp_speciality='Transportation'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==4 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Event Planner' AND sp_speciality='Hall'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==4 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Vendor' AND sp_speciality='Hall'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==5 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Event Planner' AND sp_speciality='DJ'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='Vendor' AND sp_speciality='DJ'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
    });
});

app.get('/users/event', function(req, res){
  //PG connect
  pool.connect(function(err,client,done){
    if(err){
      return console.error('Error fetching client from pool',err);
    }
    client.query('SELECT * from Event',function(err,result){
      if(err){
        return console.error('Error running query',err);
      }
      res.render('event',{event: result.rows});
      done();
    });
  });
});

app.post('/users/event_add', function(req,res){
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query('INSERT INTO event(event_name, event_description) VALUES($1, $2)', [req.body.event_name, req.body.event_description],function(err,result){
        done();
        res.redirect('/users/event');
      });
    });
});

app.post('/users/event_edit', function (req, res) {
    console.log("edit");
    console.log(req.body.id);
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query('UPDATE event SET event_name = $1, event_description = $2 WHERE event_id = $3', [req.body.name, req.body.description, req.body.id],function(err,result){
        done();
        res.redirect('/users/event');
      });
    });
});

app.post('/users/event_participants', function (req, res) {
    console.log('participants');
    console.log(req.body.participants);
    console.log(req.body.id);
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query('UPDATE event SET event_participants = $1, invite_status = $2 WHERE event_id = $3', [req.body.participants, 0, req.body.id],function(err,result){
        done();
        res.redirect('/users/event');
      });
    });
});

app.delete('/users/event_delete/:id', function(req, res){
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query('DELETE FROM event WHERE event_id = $1', [req.params.id],function(err,result){
        done();
        console.log("hey");
        res.redirect('/users/event');
        res.send("DELETE Request Called");
      });
    });
});

app.get('/users/profile',(req,res) => {
    res.render('profile.ejs');
});

app.post('/users/profile_add', function(req,res){
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query('INSERT INTO service_provider(sp_username, sp_type, sp_speciality, sp_headline, sp_description) VALUES($1, $2, $3, $4, $5)', [req.body.sp_type, req.body.sp_speciality, req.body.sp_headline, req.body.sp_description],function(err,result){
        done();
        res.redirect('/users/dashboard');
      });
    });
});

app.get('/users/invite', function(req, res){
  //PG connect
  pool.connect(function(err,client,done){
    if(err){
      return console.error('Error fetching client from pool',err);
    }
    client.query("SELECT * from event WHERE event_participants = 'Khan'",function(err,result){
      if(err){
        return console.error('Error running query',err);
      }
      res.render('invite',{event: result.rows});
      done();
    });
  });
});

app.post('/users/invite_accept', function (req, res) {
  console.log(req.body.id);
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query("UPDATE event SET invite_status = 1 WHERE event_id = $1 AND event_participants = 'Khan'", [req.body.id],function(err,result){
        done();
        res.redirect('/users/invite');
      });
    });
});

app.post('/users/invite_reject', function (req, res) {
  console.log(req.body.id);
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query("UPDATE event SET invite_status = -1 WHERE event_id = $1 AND event_participants = 'Khan'", [req.body.id],function(err,result){
        done();
        res.redirect('/users/invite');
      });
    });
});


app.listen(PORT, () => {
    console.log('Server running on port',PORT);
});
