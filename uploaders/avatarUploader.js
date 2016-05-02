var config = require('../config/config');
var cloudinary = require('cloudinary');

cloudinary.config(config.cloudinary);

exports.upload = function(user, file, callback) {
	if(!file) {
		return callback(user);
	}
	options = {public_id: user.id + '-' + Date.now()};
	cloudinary.uploader.upload(file.path, function(thumbnail) {
		user.avatar_url = thumbnail.url;
		callback(user);
	}, options);
};