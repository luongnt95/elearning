var express = require('express');
var router = express.Router();

Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');

router.get('/:id/profile', function(req, res, next) {
	var user_id = req.params.id;
	Student.findOne({user_id: user_id}, function(err, student) {
		if(err)	{
			res.send(err);
		}
		else {
			res.render('students/edit', {"student": student});
		}
	});
});

router.post('/:id/update', function(req, res, next) {
	var user_id = req.params.id;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var username = req.body.username;
	/*var street_address = req.body.street_address;
	var city = req.body.city;
	var state = req.body.state;
	var password = req.body.password;
	var password2 = req.body.password2;
	var type = req.body.type;
	var zip = req.body.zip;*/
	

	User.findById(user_id, function(err, user) {
		if(err) {
			res.send(err);
		}
		else {
			user.username = username;
			user.email = email;
			user.save(function(err) {
				if(err) {
					res.send(err);
				}
				else {
					res.locals.user = user;
				}
			});
		}
	});

	Student.findOne({user_id: user_id}, function(err, student) {
		if (err) {
			res.send(err);
		}
		else {
			student.first_name = first_name;
			student.last_name = last_name;
			student.email = email;
			student.save(function(err) {
				if(err) {
					res.send(err);
				}
			});
		}
	});

	res.redirect('/');
});

router.get('/classes', ensureAuthenticated, function(req, res, next){
	Student.getStudentByUsername(req.user.username, function(err, student){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render('students/classes', {"student": student});
		}
	});
});

router.post('/classes/register', function(req, res){
	var info = {
		student_username : req.user.username,
		class_id : req.body.class_id,
		class_title : req.body.class_title
	}
	
	Student.register(info, function(err, student){
		if (err) throw err;
		console.log(student);
	});
	req.flash('success', 'You are now registed');
	res.redirect('/students/classes');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = router;