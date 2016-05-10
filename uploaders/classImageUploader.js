var config = require('../config/config');
var cloudinary = require('cloudinary');

cloudinary.config(config.cloudinary);

exports.upload = function(klass, file, callback) {
  if(!file) {
    callback(klass);
  }
  else {
    options = {public_id: klass.id + '-' + Date.now()};
      cloudinary.uploader.upload(file.path, function(thumbnail) {
      klass.image_url = thumbnail.url;
      callback(klass);
    }, options);
  }
};
