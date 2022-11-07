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

var my_id=-1;
var login_type;

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
    my_id=req.user.login_id;
    login_type=req.user.type;
    res.render('dashboard',{user: req.user.first_name, login_id:my_id});
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
                        `INSERT INTO login_details(email,first_name,last_name,password,street,city,state,country,type)
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                        RETURNING login_id`,
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
        client.query("SELECT * FROM service_provider WHERE sp_type='planner' AND sp_speciality='Catering'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==1 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='vendor' AND sp_speciality='Catering'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==2 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='planner' AND sp_speciality='Tenting'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==2 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='vendor' AND sp_speciality='Tenting'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==3 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='planner' AND sp_speciality='Transportation'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==3 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='vendor' AND sp_speciality='Transportation'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==4 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='planner' AND sp_speciality='Hall'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==4 && t==2)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='vendor' AND sp_speciality='Hall'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else if(s==5 && t==1)
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='planner' AND sp_speciality='DJ'",function(err,result){
          console.log(result);
          res.render('query',{service_provider: result.rows});
          done();
        });
      }
      else
      {
        client.query("SELECT * FROM service_provider WHERE sp_type='vendor' AND sp_speciality='DJ'",function(err,result){
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
    console.log('login_id: ', my_id);
    client.query('SELECT * from event where event_owner=$1',[my_id],function(err,result){
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
      console.log('login_id: ', my_id);
      client.query('INSERT INTO event(event_name, event_description,event_owner) VALUES($1, $2,$3)', [req.body.event_name, req.body.event_description,my_id],function(err,result){
        done();
        res.redirect('/users/event');
      });
    });
});

app.post('/users/event_edit', function (req, res) {
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

app.delete('/users/event_delete/:id', function(req, res){
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      console.log(req.params.id);
      client.query('DELETE FROM event WHERE event_id = $1', [req.params.id],function(err,result){
        done();
        console.log("hey");
        res.send("DELETE Request Called");
      });
    });
});

app.get('/users/profile',(req,res) => {
  pool.connect(function(err,client,done){
    if(err){
      return console.error('Error fetching client from pool',err);
    }
    console.log('login_id: ', my_id);
    client.query('SELECT * from service_provider where prof_owner=$1',[my_id],function(err,result){
      if(err){
        return console.error('Error running query',err);
      }
      if (result.rows.length === 0)
      res.render('build_profile.ejs');
      else 
      //Temporary: Needs separate display page
      //To Do: Display profile option only to service providers
      res.render('query',{service_provider: result.rows});
      done();
    });
  });
});

app.post('/users/profile_add', function(req,res){
    pool.connect(function(err,client,done){
      if(err){
        return console.error('Error fetching client from pool',err);
      }
      client.query('INSERT INTO service_provider(sp_type, sp_speciality, sp_headline, sp_description, prof_owner) VALUES($1, $2, $3, $4,$5)', [login_type, req.body.sp_speciality, req.body.sp_headline, req.body.sp_description, my_id],function(err,result){
        done();
        res.redirect('/users/dashboard');
      });
    });
});

app.get('/users/chat_box/:id', function(req, res){
  //PG connect
  pool.connect(function(err,client,done){
    if(err){
      return console.error('Error fetching client from pool',err);
    }
    console.log('login_id: ', my_id);
    console.log('other_id: ', req.params.id);
    var other_id=req.params.id;
    client.query('SELECT * from chat where (msg_sender=$1 and msg_reciever=$2) or (msg_sender=$3 and msg_reciever=$4)',[my_id,req.params.id,req.params.id,my_id],function(err,result){
      if(err){
        return console.error('Error running query',err);
      }
      console.log(result.rows);
      res.render('chat_box',{chat: result.rows, other_id: other_id});
      done();
    });
  });
});

app.post('/users/chat_add', function(req,res){
  pool.connect(function(err,client,done){
    if(err){
      return console.error('Error fetching client from pool',err);
    }
    console.log('Sender_id: ',my_id);
    console.log('Reciever_id: ',req.body.reciever_id);
    console.log('Reciever_id: ',req.body.message);
    client.query('INSERT INTO chat(msg_sender, msg_reciever, msg) VALUES($1, $2, $3)', [my_id, req.body.reciever_id, req.body.message],function(err,result){
      done();
      res.redirect('/users/chat_box/'+req.body.reciever_id);
    });
  });
});

app.listen(PORT, () => {
    console.log('Server running on port',PORT);
});
