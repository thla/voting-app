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
			const optionsArray = getOptions(req.body);
		
			const newPoll = Poll({ _user_id: req.user._id , question: req.body.question, options: optionsArray });
		
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
	        optionNames: optionNames,
	        data: data,	        
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
	
	
	this.addOption = function(req, res) {
		const optionname = req.body.newoption;
		if ( optionname == '' || optionname == undefined )
		{
			console.log('Cannot add empty option');		
			res.redirect('/poll/' + req.params.id);
		}
		
		const newoption = {name : optionname, count: 0};console.log(newoption)
		const poll = Poll.where('_id').eq(req.params.id);
		poll.update({$push: {options: newoption}})
			.exec(function(err, poll)
		{
    		if (err) return res.sendStatus(500);
    		res.redirect('/poll/' + req.params.id);
		});		
	}
	
	
	this.vote = function(req, res) {
		Poll.update( {
		  _id: req.params.id,
		  "options.name": req.body.option
		}, {
		  $inc: {"options.$.count": 1},
		}, function(err, raw) {
		  if (err) return res.sendStatus(500);
		  res.redirect('/poll/' + req.params.id);
		});
	}


	function getOptions(inputs) {
		if(typeof inputs !== 'object') return;
	
		var options = [];
		var optionsArray = [];
	
		for(var key in inputs) {
			if(key.indexOf('option-field') !== -1) {
				var option = inputs[key];
				//console.log('option ' + option);
				if(option !== '') {
					options = option.split("\r\n");
					options = options.filter(function(n){ return n != '' && n != undefined }); 
					for (var i = 0; i < options.length; i++) {
						optionsArray.push({"name": options[i], "count": 0});
						console.log(options[i]);
					}
					break;
				}
			}
		}
		return optionsArray;
	}
}

module.exports = pollHandler;