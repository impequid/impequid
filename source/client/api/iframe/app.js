window.addEventListener('message', receive, false);

var callbacks = {};

function receive (event) {
	var message = event.data;
	var id = message.id;
	var api = message.api;
	var data = message.data;
	console.info('impequid-api', event);
}
