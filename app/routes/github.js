'use strict';

var passport = require('passport');
var GitHubStrategy  = require('passport-github').Strategy;
var	User = require('../models/users.js');
var config = require('../../config.js');

passport.use(new GitHubStrategy({
    clientID: config.GITHUB_KEY,
    clientSecret: config.GITHUB_SECRET,
    callbackURL: config.app.url + 'auth/github/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('access tokrn');
  	User.findOne({ id: profile.id }, function(err, user) {
  		if(!user) {
  			const newUser = User({
  				id: profile.id,
          username: profile.username
  			});
  			newUser.save(function(err, user) {
  				if(err) {
  					console.log(err);
  				} else {
  					return cb(err, user);
  				}
  			});
  		} else {
  			return cb(err, user);
  		}
  	});
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;