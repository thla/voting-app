const config = {};

config.db = {};

config.db.url = process.env.MONGO_URI || 'mongodb://localhost:27017/clementinejs';
config.db.port = process.env.PORT || 5000;

config.GITHUB_KEY = process.env.GITHUB_KEY || 'declare your github key here';
config.GITHUB_SECRET = process.env.GITHUB_SECRET || 'declare your github secret here';

config.session = {};
config.session.secret = process.env.SESSION_SECRET;

config.app = {};
config.app.port = process.env.PORT || 8080;
config.app.url = process.env.APP_URL;

module.exports = config;

