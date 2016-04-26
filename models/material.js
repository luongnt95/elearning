var mongoose = require('mongoose');

var MaterialSchema = mongoose.Schema({
	class_id: {type: String},
	file_path: {type: String},
	file_name: {type: String},
	mime_type: {type: String}
});

var Material = module.exports = mongoose.model('Material', MaterialSchema);
