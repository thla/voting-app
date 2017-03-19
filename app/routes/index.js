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
			pollHandler.newPoll(req, res);
		});
	

	app.route('/')
		.get(function(req, res) {
			pollHandler.getPolls(req, res, 'home');
		});
	
	app.route('/mypolls').all(isLoggedIn)
		.get(function(req, res) {
			pollHandler.getMyPolls(req, res, 'mypolls');
		});
	
	
	//twitter oauth 
	app.get('/auth/twitter', passport.authenticate('twitter'));
	
	//twitter callback, on success redirect user to their polls, on failure redirect to home page
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		failureRedirect: '/',
		successRedirect: '/'
	}));	
	
	app.get('/auth/github',
	  passport.authenticate('github', { scope: [ 'user:email' ] }));
	
	app.get('/auth/github/callback', 
	  passport.authenticate('github', { failureRedirect: '/' }),
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


	app.route('/poll/:id')
		.get(pollHandler.viewPoll)
		.post(pollHandler.vote)
		.put(isLoggedIn, pollHandler.addOption)
		.delete(isLoggedIn, pollHandler.deletePoll);
 //   	

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

