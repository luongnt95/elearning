var express = require('express');
var router = express.Router();

Class = require('../models/class');
/* GET home page. */
router.get('/', function(req, res, next) {
	Class.getClasses(function(err, classes){
		if (err){
			res.send(err);
		} else {
			res.render('index', { "classes": classes.slice(0, 3), "isHome": true, "messages": req.flash('success')});
		}
	}, 100);
});

module.exports = router;
