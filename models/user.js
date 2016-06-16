var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Use Schema
var userSchema = mongoose.Schema({
	username:{
		type: String,
		index: { unique: true }
	},
	email: {
		type: String
	},
	password:{
		type: String,
		bcrypt: true
	},
	avatar_url:{
		type: String
	},
	created_at:{
		type: Date, 
		default: Date.now
	},
	updated_at:{
		type: Date,
		default: Date.now
	},
	type:{
		type: String
	},
	avatar_url: {type: String},
	notifications: [{
		class_id: [mongoose.Schema.Types.ObjectId],		
		class_title: String,
		instructor: String,
		notification: String
	}]
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	try{		
		var query = {
				username:username
			};
		User.findOne(query, callback);
	} catch(err){
		console.log(err);
	}
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

module.exports.updateNotification = function(info, callback){
	// console.log(info);
	User.findOne({username: info.username}, function(err, user){
		user.notifications.push(info.notification);
		user.save(function(err, user){
			if (err) throw err;
			// console.log("user= " + user);
		});
	});
}