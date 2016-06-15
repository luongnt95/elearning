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

router.post('/new', auth.ensureAuthenticated, function(req, res, next) {
	var comment = new Comment();
	//console.log("data = ", comment_params(req));

	assign(comment, comment_params(req));
	if (!comment.content) {
		res.setHeader('Content-Type', 'application/json');
    	res.status(400).send(JSON.stringify({ message: 'Your comment must not empty!', result: null}));
	}
	else {		
		comment.save(function(err, result) {
			if(err) res.send(err);

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify({ message: 'Your comment is added!', result }));
		});
	}
});


function comment_params(req) {
	return only(req.body, 'content avatar_url username class_id lesson_number');
}

module.exports = router;
