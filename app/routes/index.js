'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();
	
	
	app.route('/new').all(isLoggedIn)
		.get( (req, res) => {
			res.render('new');
		})
		.post( (req, res) => {
			console.log(req.body.question);
			const options = getOptions(req.body);
		
			//const newPoll = Poll({ _user_id: req.user._id , question: req.body.question, options: options.options, votes: options.votes });
		
			//newPoll.save(function(err, poll) {
			//	if(err) {
			//		console.log(err);
			//		res.redirect('/new');
			//	} else {
					res.redirect('/new');
			//	}
			//}); 
		});
	

	app.route('/')
		.get(function(req, res) {
			pollHandler.getPolls(req, res, 'home');
		});
	
	
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/new' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });		
		


	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};

function getOptions(inputs) {
	if(typeof inputs !== 'object') return;

	var options = [];
	var votes = [];

	for(var key in inputs) {
		if(key.indexOf('option-field') !== -1) {
			var option = inputs[key];
			if(option !== '') {
				options.push(option);
				votes.push(0);
			}
		}
	}
	return {options: options, votes: votes}
}
