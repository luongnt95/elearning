var cloudinary = require('cloudinary');
var config = require('../config/config');

cloudinary.config(config.cloudinary);

exports.upload = function(klass, file, callback) {
  if (!file)
  	console.log("No");
    return callback(klass);

  options = { public_id: 'materials/' + klass._id };
  console.log("yes");
  cloudinary.uploader.upload(file.path, function(material) {
    klass.materials.push({url: material.url});
    callback(klass);
  }, options);
}