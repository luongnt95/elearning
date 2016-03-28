var express = require('express');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();

var User = require('../models/user');

var Student = require('../models/student');

var Instructor = require('../models/instructor');

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

		if (type = 'student'){
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
					username: username
				});

				User.saveStudent(newUser, newStudent, function(err, user){
					console.log('Student created');
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
				username: username
			});
			User.saveInstructor(newUser, newInstructor, function(err, user){
				console.log('Instructor created');
			});
		}

		req.flash('success', 'User added');
		res.redirect('/');
	}
});

//GET log in
router.get('/login', function(req, res, next){
	res.render('login', {
		'title': 'Login'
	});
});

//POST Login

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
	    User.getUserbyUsername(username, function(err, user) {
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


router.post('/login',
 	passport.authenticate('local', {
    	failureRedirect: '/users/login',
    	failureFlash: 'Invalid username or password'
	}), 
	function(req, res) {
		console.log('Authentication Successful');
		req.flash('success', 'You are logged in ');
		res.redirect('/');
	}
);

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});

module.exports = router;
