var mongoose = require('mongoose');

var commentSchema = mongoose.Schema(
	{
		content: String,
		class_id: String,
		lesson_number: Number,
		username: String,
    	avatar_url: String
	},
	{
		timestamps: true
	}
);

var Comment = module.exports = mongoose.model('Comment', commentSchema);
