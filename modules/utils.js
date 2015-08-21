var fs = require('fs');

function RouteHandler (app) {
	this.app = app;
}
RouteHandler.prototype.use = function (options) {
	if (options.require) {
		var route = require(options.require);
		options.get = route.get;
		options.put = route.put;
		options.post = route.post;
		options.delete = route.delete;
	}
	if (options.get) {
		this.app.get(options.path, options.get);
	}
	if (options.post) {
		this.app.post(options.path, options.post);
	}
	if (options.delete) {
		this.app.delete(options.path, options.delete);
	}
	if (options.put) {
		this.app.put(options.path, options.put);
	}
}

function loadPlugins () {
	var plugins = {};
	var pluginConfig;

	// read directory #TODO
	// fs.
	// for (var i = 0; i < directory.length; i++) {
	// 	// get plugin config
	// 	pluginConfig = require('../plugins/' + i + '/config.json');
	//
	// 	//
	// 	plugins[directory[i]] = {
	// 		script: require('../plugins/' + i),
	// 		config: pluginConfig
	// 	};
	// }

	return plugins;
}

module.exports = {
	RouteHandler: RouteHandler,
	loadPlugins: loadPlugins
};
