var express = require('express');
var router = express.Router();

Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

router.get('/:id/profile', function(req, res, next) {
	var user_id = req.params.id;
	Instructor.findOne({user_id: user_id}, function(err, instructor) {
		if(err) {
			res.send(err);
		}
		else {
			res.render('instructors/edit', {"instructor": instructor});
		}
	});
});

router.post('/:id/update', function(req, res, next) {
	var user_id = req.params.id;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var username = req.body.username;

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

	Instructor.findOne({user_id: user_id}, function(err, instructor) {
		if(err) {
			res.send(err);
		}
		else {
			instructor.first_name = first_name;
			instructor.last_name = last_name;
			instructor.email = email;
			instructor.save(function(err) {
				if(err) {
					res.send(err);
				}
			});
		}
	});
	res.redirect('/');
});

router.get('/classes', ensureAuthenticated, function(req, res, next){
	Instructor.getInstructorByUsername(req.user.username, function(err, instructor){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render('instructors/classes', {"instructor": instructor});
		}
	});
});

router.post('/classes/register', function(req, res){
	var info = {
		instructor_username : req.user.username,
		class_id : req.body.class_id,
		class_title : req.body.class_title
	}
	
	Instructor.register(info, function(err, instructor){
		if (err) throw err;
		console.log(instructor);
	});
	req.flash('success', 'You are now registed as an Instructor');
	res.redirect('/instructors/classes');
});

router.get('/classes/:id/lessons/new', ensureAuthenticated, function(req, res, next){	
	res.render('instructors/newlesson', {"class_id": req.params.id});	
});

router.post('/classes/:id/lessons/new', function(req, res){
	var info = {
		class_id: req.params.id,
		lesson_number : req.body.lesson_number,
		lesson_title : req.body.lesson_title,
		lesson_body : req.body.lesson_body
	}
	
	Class.addLesson(info, function(err, lesson){
		if (err) throw err;
		console.log("lesson :  ", lesson);
	});
	req.flash('success', 'You are added a new lesson');
	res.redirect('/instructors/classes');
});

router.get('/classes/new', ensureAuthenticated, function(req, res, next){	
	res.render('instructors/newClass');	
});

router.post('/classes/new', ensureAuthenticated, function(req, res){
	var newClass = new Class({
		title: req.body.class_title,
		description : req.body.class_description,
		instructor: req.user.username
	});
	
	Class.saveClass(newClass, function(err, newClass){
		if (err) throw err;
		console.log("class :  ", newClass);
		var info = {
			instructor_username : req.user.username,
			class_id : newClass._id,
			class_title : newClass.title
		}
		Instructor.saveClass(info, function(err, instructor){
			if (err) throw err;
			console.log(instructor);
		});
	});
	req.flash('success', 'You are added a new class');
	res.redirect('/instructors/classes');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = router;