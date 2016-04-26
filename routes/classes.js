var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads/materials');
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname+ '-' + Date.now());
	}
});

var upload = multer({storage: storage}).array('material', 2);

Class = require('../models/class');
Student = require('../models/student');
Material = require('../models/material');

router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if (err){
			console.log(err);
			res.send(err);
		} else {
  			res.render('classes/index', { "classes": classes });
		}
	}, 20);
});

router.get('/:id', function(req, res, next){
	Class.getClassesById([req.params.id], function(err, classDetail){
		if (err) {
			console.log(err);
			res.send(err);
		} else {						
			isStudent = false;
			if (req.user){
				isStudent = req.user.type == 'student';
			}
			res.render('classes/detail', {"class": classDetail, "isStudent": isStudent });
		}
	})
});

router.get('/:id/materials', function(req, res, next) {
	res.render('classes/materials', null);
});

router.post('/:id/upload', function(req, res, next) {
	upload(req, res, function(err) {
		if(err) {
			res.send(err);
		}
		else {

			res.end("File is uploaded!");
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
