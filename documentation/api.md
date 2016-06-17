# API

## Apps Authentication

If an app wants to use an impequid account, is has to send users to this link:

`https://:impequidServer/authenticate/:appServer/?permissions=comma,separated,permissions`

The impequid server will then get the app name, url and description from an [impequid service provider](https://github.com/dodekeract/impequid-service-provider).

The user then can accept the permissions (or log in to accept them). If the user already accepted the requested permissions, the authentication immediately succeeds and returns to the app with a new token.

After the user accepted, or the request was accepted automatically, he will be redirected to the `https://:appServer/authenticate/:token@:impequidServer` URL. (Note that an app can set a custom URL for this, but the above format is the default one)

### Token Digestion

The app may then use the provided `:token` to contact the `:impequidServer` and use the impequid API endpoints.

### Client-Side App Example

This is the simplest type of impequid app. It just takes the `:token` and contacts the API endpoint directly.

````javascript

import ImpequidAPI from 'impequid-api/client';

// assuming token is available

const iqa = new ImpequidAPI(token);

iqa.verify().then(result => {
	console.info(result); // shows visible user information

	// let's notify the user!

	iqa.notify().then(result => {
		console.log('success', result);
	}).catch(error => {
		console.error('no permissions to notify user');

		// request permission to notify
		// disable: ['redirect'] prevents automatic redirection which is otherwise the default behavior
		iqa.requestPermission({
			type: 'notify',
			disable: ['redirect']
		}).then(success => {
			console.info('user allowed permission', success);
		}).catch(denied => {
			console.error('user denied permission', denied);
		});
	});

}).catch(error => {
	console.error('token invalid');
});

````

### Server-Side App Example

Let's say you want to write an app, that runs on the server-side and needs background access to an impequid account. For that, you have to request the `backgroundAccess` permission. Which means, you most likely want to redirect users to:

`https://:impequidServer/authenticate/:appServer/?permissions=name,notify,backgroundAccess`

If the user accepts the requested permissions, he will get redirected to:

`https://:appServer/authenticate/:token@:impequidServer`

by default. If you need a different URL, make sure to open an issue on the [impequid service provider](https://github.com/dodekeract/impequid-service-provider) repository. The reasoning for this is to protect the users, since allowing any URL can be potentially harmful.

This `:token` allows you to retrieve a `backgroundAccess` token from the API.

You can do it like this:

````javascript
import ImpequidAPI from 'impequid-api/server';

const iqa = new ImpequidAPI({
	token
});

iqa.getBackgroundAccessToken().then(response => {
	console.info('new token', response.token);
	const bia = new ImpequidAPI({
		token: response.token,
		type: 'background'
	});

	// now you can do whatever you want with the exposed api, in the background
	// the biggest difference is, that the lifetime of a backgroundAccess token
	// is a lot longer, most likely more than 3 months, while a normal token
	// usually lives for at most 7 days
	// in addition to that, users may chose to allow only requests from their IP
	// address for normal tokens, disabling all features for servers, except the
	// requestBackgroundAccessToken API

}).catch(error => {
	console.error('something went wrong', error);
});
````

Then you just save that token and use it. If the user decides to remove it, just repeat the above steps.

## Available API Commands

- `verify` checks if the token is valid
- `getBackgroundAccessToken` requests a background-access-token, at most one per app is allowed
- `notify({message: String, url: String})` sends a notification to the user, using a method of his choice
- `requestPermissions(['list', 'of', 'permissions'])` is a useful wrapper for requesting new permissions:
	- the user chooses his preferred method, you can blacklist redirection though, since it can disrupt the app experience
	- planned types:
		- redirect (default)
		- new-tab (alternative, essentially the same)
		- indirect (sends a notification to the user, that can be accepted or declined)
	- once a user has accepted the request, the promise will be resolved (`.then()`), otherwise it will be rejected (`.catch()`)
- `getPermissions` returns all permissions, the current token has
- `authenticate(appName)` redirects
