var config = require('../config/config');
var cloudinary = require('cloudinary');

cloudinary.config(config.cloudinary);

exports.upload = function(klass, file, callback) {
  if(!file) {
  	return callback(klass);
  }
  options = {public_id: klass.id + '-' + Date.now()};
  cloudinary.uploader.upload(file.path, function(material) {
    klass.materials.push({url: material.url, name: file.originalname});
    callback(klass);
  }, options);
}