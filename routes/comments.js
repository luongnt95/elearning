var express = require('express');
var router = express.Router();
var assign = require('object-assign');
var only = require('only');
var auth = require('../helpers/authentication');

Comment = require('../models/comment');

router.post('/', auth.ensureAuthenticated, function(req, res, next) {
	var comment = new Comment();
	assign(comment, comment_params(req));
	comment.save(function(err) {
		if(err) res.send(err);
    console.log(comment);
		res.redirect(`/classes/${req.body.class_id}/lessons/${req.body.lesson_number}`);
	});
});

function comment_params(req) {
	return only(req.body, 'content avatar_url username class_id lesson_number');
}

module.exports = router;
