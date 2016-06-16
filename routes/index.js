var express = require('express');
var router = express.Router();

Class = require('../models/class');
/* GET home page. */
router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if (err){
			console.log(err);
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
						res.render('index', { "classes": classes, "isHome": true, "messages": req.flash('success')});
					}
				});
			}
		}
	}, 3);
});

module.exports = router;
