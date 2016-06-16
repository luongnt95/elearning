var express = require('express');
var router = express.Router();
var uploader = require('../uploaders/materialUploader');
var assign = require('object-assign');
var only = require('only');

Class = require('../models/class');
Student = require('../models/student');
Rating = require('../models/rating');

router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if (err){
			res.send(err);
		} else {
			var ratingScores = [];
			for(i in classes) {
				var klass = classes[i];
				Rating.find({class_id: klass.id}, function(err, ratings) {
					var sum = 0;
					var len = ratings.length;					
					for(var i = 0; i < len; i++) {
						sum += ratings[i].score;
					}
					if(len == 0) {
						ratingScores.push(0);
					}
					else {
						ratingScores.push(Math.round(sum/len));
					}
					if(ratingScores.length == classes.length) {
						for(var index in classes) {
							classes[index].ratingScore = ratingScores[index];
						}
						res.render('classes/index', { "classes": classes});	
					}
				});
			}
		}
	}, 100);
});

router.get('/:id', function(req, res, next){
	Class.findById(req.params.id, function(err, classDetail){
		if (err) {
			res.send(err);
		}
		else {
			isStudent = false;
			if (req.user){
				isStudent = req.user.type == 'student';
			}

			res.render('classes/detail', {"class": classDetail, "isStudent": isStudent});
		}
	});
});

router.get('/:id/materials', function(req, res, next) {
	Class.findById(req.params.id, function(err, klass) {
		if(err) {
			res.send(err);
		}
		else {
			isStudent = false;
			if(req.user) {
				isInstructor = req.user.type == 'instructor';
			}
			res.render('classes/materials', {"klass": klass, "isInstructor": isInstructor});
		}
	});
});

router.post('/:id/upload', function(req, res, next) {
	Class.findById(req.params.id, function(err, klass) {
		if(err)	{
			res.send(err);
		}
		else {
			var file = null;
			try {
				file = req.files['material'][0];	
			} catch(e) {
				console.log(e);
			}
			uploader.upload(klass, file, function(klass) {
				klass.save(function(err, klass) {
					if(err) {
						res.send(err);
					}
					else {
						res.redirect('/classes/' + req.params.id + '/materials');
					}
				});
			});
		}
	});

});



router.get('/:id/lessons', function(req, res, next){
	Class.getClassesById([req.params.id], function(err, classDetail){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render('classes/lessons', {"class": classDetail });
		}
	})
});

router.get('/:id/lessons/:lesson_id', function(req, res, next){
	Class.getClassesById([req.params.id], function(err, klass){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			lesson = {
				lesson_title : "Could not find this lesson"
			};
			for (i=0; i<klass.lessons.length; i++) {
				if (klass.lessons[i].lesson_number == req.params.lesson_id) {
					lesson = klass.lessons[i];
				}
			}
			var comments = Comment.find({class_id: klass.id, lesson_number: lesson.lesson_number}).sort({createdAt: -1}).exec(function(err, comments) {
				if(err)	res.send(err);
				res.render('classes/lesson', {"class": klass, "lesson":lesson, "comments": comments });
			});
		}
	})
});

module.exports = router;
