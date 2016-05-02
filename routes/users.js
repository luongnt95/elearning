var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

var Student = require('../models/student');

var Instructor = require('../models/instructor');

var uploader = require('../uploaders/avatarUploader');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});

router.post('/signup', function(req, res, next){
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var street_address = req.body.street_address;
	var city = req.body.city;
	var state = req.body.state;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var type = req.body.type;
	var zip = req.body.zip;

	// Form Field Validation
	try{
		req.checkBody('first_name', 'First name is required').notEmpty();
		req.checkBody('last_name', 'Last name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email must be a valid maill address').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

		var errors = req.validationErrors();
	}
	catch(err){
		console.log(err);
	}

	if (errors){		
		res.render('users/signup', {
			errors: errors,
			first_name: first_name,
			last_name: last_name,
			street_address: street_address,
			city: city,
			state: state,
			zip: zip,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			email: email,
			username: username,
			password: password,
			type: type
		});

		if (type == 'student'){
			try{				
				var newStudent = new Student({
					first_name: first_name,
					last_name: last_name,
					address: [{
						street_address: street_address,
						city: city,
						state: state,
						zip: zip
					}],
					email: email,
					username: username,
					user_id: newUser.id
				});

				uploader.upload(newUser, req.files['avatar'][0], function(user) {
					User.saveStudent(user, newStudent, function(err, user){
						console.log('Student created');
					});
				});

			} catch(err){
				console.log(err);
			}
		} else {
			var newInstructor = new Instructor({
				first_name: first_name,
				last_name: last_name,
				address: [{
					street_address: street_address,
					city: city,
					state: state,
					zip: zip
				}],
				email: email,
				username: username,
				user_id: newUser.id
			});

			uploader.upload(newUser, req.files['avatar'][0], function(user) {
				User.saveInstructor(user, newInstructor, function(err, user){
					console.log('Instructor created');
				});
			});
		}

		req.flash('success', 'User added');
		res.redirect('/');
	}
});

//GET log in
/* router.get('/login', function(req, res, next){
	res.render('login', {
		'title': 'Login'
	});
});
*/
//POST Login

var tokens = {}

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
}); 

passport.use(new LocalStrategy(
	function(username, password, done) {
	    User.getUserByUsername(username, function(err, user) {
	        if (err) throw err;
	        if (!user) {
	            console.log('Invalid Username');
	            return done(null, false, {
	                message: 'Invalid Username'
	            });
	        }

	        User.comparePassword(password, user.password, function(err, isMatch) {
	            if (err) throw err;
	            if (isMatch) {
	                return done(null, user);
	            } else {
	                console.log('Invalid Password');
	                return done(null, false, {
	                    message: 'Invalid Password'
	                });
	            }
	        });
	    });
	}
));
/*
// Remember Me cookie strategy
//   This strategy consumes a remember me token, supplying the user the
//   token was originally issued to.  The token is single-use, so a new
//   token is then issued to replace it.
passport.use(new RememberMeStrategy(
  function(token, done) {
    consumeRememberMeToken(token, function(err, uid) {
      if (err) { return done(err); }
      if (!uid) { return done(null, false); }
      
      findById(uid, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    });
  },
  issueToken
)); 

function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res, next) {
    // Issue a remember me cookie if the option was checked
    if (!req.body.remember_me) { return next(); }
    
    issueToken(req.user, function(err, token) {
      if (err) { return next(err); }
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
      return next();
    });
  },
  function(req, res) {
    res.redirect('/');
  });
*/
router.post('/login',
 	passport.authenticate('local', {
    	failureRedirect: '/',
    	failureFlash: 'Invalid username or password'
	}), 
	function(req, res, next) {
		console.log('Authentication Successful');
		req.flash('success', 'You are logged in ');
		var usertype = req.user.type;
		res.redirect('/' + usertype + 's/classes');
	}
);

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = router;
