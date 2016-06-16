var express = require('express');
var router = express.Router();
var assign = require('object-assign');
var only = require('only');

Rating = require('../models/rating');

router.post('/', function(req, res, next) {
	var rating = new Rating();
	assign(rating, rating_params(req));
	rating.save(function(err) {
		if(err) res.send(err);
	});
});

function rating_params(req) {
	return only(req.body, 'class_id user_id score');
}

module.exports = router;