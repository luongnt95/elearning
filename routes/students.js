var express = require('express');
var router = express.Router();
var assign = require('object-assign');
var only = require('only');
var cache = require('memory-cache');
var uploader = require('../uploaders/avatarUploader');

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
	User.findById(req.params.id, function(err, user) {
		if(err) {
			res.send(err);
		}
		else {
			assign(user, user_params(req));
			uploader.upload(user, req.files['avatar'][0], function(user) {
				user.save(function(err) {
					if(err) {
						res.send(err);
					}
					else {
						Student.findOne({user_id: req.params.id}, function(err, student) {
							assign(student, student_params(req));
							student.save(function(err) {
								if(err) {
									res.send(err);
								}
								else {
									res.locals.user = user;
									res.redirect('/');
								}
							});
						});
					}
				});
			});
		}
	});
});

router.get('/classes', ensureAuthenticated, function(req, res, next){
	var student = cache.get(req.user.username);
	if (student) {
		//console.log("student0 = "+ student);
		res.render('students/classes', {"student": student, "messages": req.flash('success')});
	}
	else {
		Student.getStudentByUsername(req.user.username, function(err, student){
			if (err) {
				res.send(err);
			} else {
				cache.put(req.user.username, student);
				//console.log("student1 = "+ student);
				res.render('students/classes', {"student": student, "messages": req.flash('success')});
			}
		});

	}
});


router.post('/classes/register', function(req, res, next){
	var info = {
		student_username : req.user.username,
		class_id : req.body.class_id,
		class_title : req.body.class_title
	}

	Student.register(info, function(err, result){
		if (err) throw err;
		//console.log("result = ", result);
		if (result) {
			cache.del(req.user.username);
			req.flash('success', 'You are now registed');
			res.redirect('/students/classes');
		}
		else {
			req.flash('success', 'You are now registed');
			res.redirect('/students/classes');
		}
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function student_params(req) {
	return only(req.body, 'first_name last_name email');
}

function user_params(req) {
	return only(req.body, 'username email')
}

module.exports = router;
