var config = require('../config/config');
var cloudinary = require('cloudinary');

cloudinary.config(config.cloudinary);

exports.upload = function(user, file, callback) {
	if(!file) {
		console.log("no");
		return callback(user);
	}
	options = {public_id: user.id + '-' + Date.now()};
	cloudinary.uploader.upload(file.path, function(thumbnail) {
		console.log("Yes");
		user.avatar_url = thumbnail.url;
		callback(user);
	}, options);
};