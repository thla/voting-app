'use strict';

var Poll = require('../models/poll.js');

function pollHandler() {

	this.getMyPolls = function(req, res, view) {
		Poll.find({ _user_id: req.user._id }, 'question', function(err, polls) {
			if(err){ 
				console.log(err);
				res.render(view);
			} else {
				res.render(view, {polls: polls});
			}
		});
	};
	
	this.newPoll = function(req, res) {
			const options = getOptions(req.body);
		
			const newPoll = Poll({ _user_id: req.user._id , question: req.body.question, options: options.options, votes: options.votes });
		
			newPoll.save(function(err, poll) {
				if(err) {
					console.log(err);
					res.redirect('/new');
				} else {
					res.redirect('/mypolls');
				}
			}); 
	};



	this.getPolls = function(req, res, view) {
		Poll.find({
		}).exec((err, results) => {
			if(err){
				throw err;
			}
			res.render(view, {
				polls: results
			});
		});
	};

	
	this.viewPoll = function(req, res) {
	    Poll.findById(req.params.id, function(err, poll) {
	      if (err) return res.sendStatus(404);
	      var url = req.protocol + "://" + req.hostname + req.originalUrl;
	      var optionNames = poll.options.map(function(option) {
	        return `"${option.name}"`;
	      });
	      var data = poll.options.map(function(option) {
	        return option.count;
	      });
	      res.render('poll', {
	        poll: poll,
	        isLoggedIn: req.user ? true : false,
	        twittermessage: `Vote for my poll, ${poll.question}: ${url} `
	      });
	    });
	  }


	this .deletePoll = function(req, res) {
		Poll.where({ _id: req.params.id }).findOne(function(err, poll){
			if(err){ 
				console.log(err) 
				res.redirect('/')
			} else if(poll){
				//if user that requested delete owns the poll
				if(req.user._id === poll._user_id){
					poll.remove();
					res.redirect('/mypolls')
				}
			}
		});	
	};
	
	
	this .addOptions = function(req, res) {
		const userIp = req.ip;

		Poll.where({ _id: req.params.id }).findOne().exec()
		.then(function(poll){
/*			if(poll.ips.indexOf(userIp) === 0) {
				res.redirect('/poll/' + req.params.id);
				throw 'this person has already voted';
			}
*/	
			var incrementVote = {};
			incrementVote['votes.' + req.body.option] = 1;
			return poll.update({ $inc: incrementVote }).exec()
		})
		.then(function(poll){
			if(poll) res.redirect('/poll/' + req.params.id);
		})
		.catch(function(err){
			console.log(err)
			throw err;
		});
	};
	
	
	this.vote = function(req, res) {
		Poll.findOneAndUpdate({
				'id': req.poll.id
			}, {
				$inc: {
					'nbrClicks.clicks': 1
				}
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				const pollData = {
						question: result.question,
						options: result.options,
						votes: result.votes
					};
		
				res.render('poll', { pollData: JSON.stringify(pollData) });

			});
		};
	}


	function getOptions(inputs) {
		if(typeof inputs !== 'object') return;
	
		var options = [];
		var votes = [];
	
		for(var key in inputs) {
			if(key.indexOf('option-field') !== -1) {
				var option = inputs[key];
				//console.log('option ' + option);
				if(option !== '') {
					options = option.split("\r\n");
					options = options.filter(function(n){ return n != '' && n != undefined }); 
					votes = Array.apply(null, Array(options.length)).map(Number.prototype.valueOf,0);
					//votes.push(0);
					break;
				}
			}
		}
		return {options: options, votes: votes}
	}

module.exports = pollHandler;
