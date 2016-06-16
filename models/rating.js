var mongoose = require('mongoose');

var ratingSchema = mongoose.Schema({
	user_id: String,
	class_id: String,
	score: Number
});

var Rating = module.exports = mongoose.model('Rating', ratingSchema);