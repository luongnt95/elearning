var express = require('express');
var router = express.Router();

Class = require('../models/class');
/* GET home page. */
router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if (err){
			res.send(err);
		} else {
			var ratingScores = [];
			var ratingCounts = [];
			for(var i = 0; i < classes.length; i++) {
				(function(i) {
					var klass = classes[i];
					Rating.find({class_id: klass.id}, function(err, ratings) {
						var sum = 0;
						var len = ratings.length;					
						for(var j = 0; j < len; j++) {
							sum += ratings[j].score;
						}
						if(len == 0) {
							ratingScores[i] = 0;
							ratingCounts.push(0);
						}
						else {
							ratingScores[i] = Math.round(sum/len);
							ratingCounts.push(Math.round(sum/len));
						}
						if(ratingCounts.length == classes.length) {
							for(var index in classes) {
								classes[index].ratingScore = ratingScores[index];
							}
							res.render('index', { "classes": classes.slice(0, 3), "isHome": true, "messages": req.flash('success')});
						}
					});					
				})(i);
			}
		}
	}, 100);
});

module.exports = router;
