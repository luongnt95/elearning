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

module.exports = router;
