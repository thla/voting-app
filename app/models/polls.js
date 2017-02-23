'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    id: Schema.Types.ObjectId,
    question: String,
    author: String,    
    options: [{
        answer: String,
        vote: Number
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', Poll);