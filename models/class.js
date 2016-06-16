var mongoose = require('mongoose');
var User = require('../models/user');
var Student = require('../models/student');

var classSchema = mongoose.Schema({
	title:{
		type: String
	},
	description: {
		type: String
	},
	image_url: {
		type: String
	},
	_instructor: {name: String, avatar_url: String},
	lessons:[{
		lesson_number: {
			type: Number
		},
		lesson_title:{
			type: String
		},
		lesson_body:{
			type: String
		}
	}],
	students:[{
		username: String,
		avatar_url: String,
		user_id: String,
		email: String
	}],
	notifications:[{notification: String}],
	materials: [{url: String, name: String}]
});

var Class = module.exports = mongoose.model('Class', classSchema);

module.exports.getClasses = function(callback, limit){
	Class.find(callback).limit(limit);
}

module.exports.saveClass = function(newClass, callback){
	newClass.save(callback);
}

module.exports.destroyClass = function(info, callback){
	Class.remove({_id: info.class_id}, callback);
}

module.exports.getClassesById = function(id, callback){
	Class.findById(id, callback);
}

module.exports.addLesson = function(info, callback){
	class_id =  info.class_id;
	lesson_number = info.lesson_number;
	lesson_title = info.lesson_title;
	lesson_body = info.lesson_body;

	Class.findByIdAndUpdate(class_id,
		{$push:{"lessons":{lesson_number: lesson_number, lesson_title: lesson_title, lesson_body : lesson_body}}},
		{upsert:true, safe:true},
		callback
	);
}

module.exports.addStudent = function(class_id, student, callback){
	Class.findByIdAndUpdate(class_id,
		{$push:{"students":student}},
		{upsert:true, safe:true},
		callback
	);
}

module.exports.updateClass = function(info, callback){
	// console.log(info);
	Class.findById(info.class_id, function(err, classDetails){
		if (err) throw err;
		classDetails.title = info.class_title;
		classDetails.description = info.class_description;
		classDetails.notifications.push({notification: "Hi"});

		classDetails.save(callback);
	});
}