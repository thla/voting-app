'use strict';

const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
	_user_id: { type: String, require: true },
	question: { type: String, require: true },
	options: [],
	votes: [],
	ips: []
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;