var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Use Schema
var userSchema = mongoose.Schema({
	username:{
		type: String
	},
	email: {
		type: String
	},
	password:{
		type: String,
		bcrypt: true
	},
	type:{
		type: String
	}
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username){
	var query = {
			username:username
		};
	Class.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, password, callback){
	bcrypt.compare(candidatePassword, password, function(err, isMatch){
		if (err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if (err) throw err;
		newUser.password = hash;
		newUser.save(callback);
	});
}

module.exports.saveStudent = function(newUser, newStudent, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if (err) throw err;
		newUser.password = hash;

		console.log('Student is being save');
		async.parallel([newUser.save, newStudent.save, callback]);

		//newUser.save(callback);
	});
}

module.exports.saveInstructor = function(newUser, newInstructor, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if (err) throw err;
		newUser.password = hash;

		console.log('Instructor is being save');
		async.parallel([newUser.save, newInstructor.save, callback]);

		//newUser.save(callback);
	});
}