var express = require('express');
var router = express.Router();

Class = require('../models/class');

router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if (err){
			console.log(err);
			res.send(err);
		} else {
  			res.render('classes/index', { "classes": classes });
		}
	}, 3);
});

router.get('/:id', function(req, res, next){
	Class.getClassesById([req.params.id], function(err, classDetail){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render('classes/detail', {"class": classDetail });
		}
	})
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
	Class.getClassesById([req.params.id], function(err, classDetail){
		if (err) {
			console.log(err);
			res.send(err);
		} else {			
			lesson = {
				lesson_title : "Could not find this lesson"
			};
			for (i=0; i<classDetail.lessons.length; i++)
				if (classDetail.lessons[i].lesson_number == req.params.lesson_id) {
					lesson = classDetail.lessons[i];
				}
			res.render('classes/lesson', {"class": classDetail, "lesson":lesson });
		}
	})
});

module.exports = router;
