var mongoose = require('mongoose');

var MaterialSchema = mongoose.Schema({
	class_id: {type: String},
	url: {type: String},
	filename: {type: String},
	mimetype: {type: String}
});

var Material = module.exports = mongoose.model('Material', MaterialSchema);
