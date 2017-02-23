'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	uid: { type: String, require: true },
	username: { type: String, require: true}
});

const User = mongoose.model('User', userSchema);

module.exports = User;