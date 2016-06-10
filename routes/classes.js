var express = require('express');
var router = express.Router();
var uploader = require('../uploaders/materialUploader');

// var cloudinary = require('cloudinary');


// cloudinary.config({
//  cloud_name: 'elearning',
//  api_key: '813799211176374',
//  api_secret: 'e9rMy7uvZDBDBePhn8tobMGDVeo'
// })

// var storage = multer.diskStorage({
// 	destination: function(req, file, callback) {
// 		callback(null, './uploads/materials');
// 	},
// 	filename: function(req, file, callback) {
// 		callback(null, file.fieldname+ '-' + Date.now());
// 	}
// });

// var upload = multer({storage: storage}).array('material', 2);

Class = require('../models/class');
Student = require('../models/student');

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
	Class.findById(req.params.id, function(err, classDetail){
		if (err) {
			res.send(err);
		}
		else {
			isStudent = false;
			if (req.user){
				isStudent = req.user.type == 'student';
			}
			res.render('classes/detail', {"class": classDetail, "isStudent": isStudent });
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
