'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require("body-parser");
var methodOverride = require('method-override')

var app = express();
require('dotenv').load();
var config = require('./config.js');
var passport = require('./app/routes/logon.js');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


mongoose.connect(config.db.url);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: config.session.secret,
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(setUserInfo);
routes(app, passport);

var port = config.app.port;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

function setUserInfo(req, res, next) {
	if(req.user) {
		res.locals.user = req.user;
	}
	next();
}