var express = require('express');

var app = express.Router();
app.use('/', express.static(__dirname + '/' + 'web/dist'));

function useRoute (options) {
	if (options.require) {
		var route = require(options.require);
		options.get = route.get;
		options.put = route.put;
		options.post = route.post;
		options.delete = route.delete;
	}
	if (options.get) {
		app.get(options.path, options.get);
	}
	if (options.post) {
		app.post(options.path, options.post);
	}
	if (options.delete) {
		app.delete(options.path, options.delete);
	}
	if (options.put) {
		app.put(options.path, options.put);
	}
}

// include routes
useRoute({path: '/login', require: './routes/login'})

module.exports = {
    experience: {
        router: app,
        init: function () {

        }
    }
}
