# Impequid Setup Guide

To properly setup an Impequid server, you will need the following tools:

- [Node.js](https://nodejs.org)
- [MongoDB](https://mongodb.com)
- [Nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install)

## Installation

- `git clone https://github.com/dodekeract/impequid`
- `cd impequid`
- `npm install`
- `npm run build`
- `npm run start`

## Configuration

Since this is a quite early release, you currently have to manually edit `config.json`.

Available options:

````javascript
{
	"port": "50000", // http port to listen to
	"listenAddress": "127.0.0.1", // address to bind to
	"mongo": {
		"url": "mongodb://127.0.0.1/database-name", // MongoDB Database URI
		"debug": false // activate logs for database events
	},
	"session": {
		"keys": ["secret_password_for_cookie_signatures"],
		"duration": "86400" // session duration in seconds
	},
	"reCaptcha": {
		"secret": "your_secret_recaptcha_key",
		"public": "your_public_recaptcha_key"
	},
	"serverName": "impequid.example.server"
}
````

## Getting A Free SSL Certificate And Subdomain

Impequid may not work without SSL, so you should try to get a SSL Certificate.

If you don't want to spend money for a SSL Certificate, you can get one from [letsencrypt](https://letsencrypt.org/getting-started/).

**Tip**: If you don't own a Domain, you can get a free subdomain from [SmartFlat DynDNS](https://dns.smartfl.at), which is an Impequid App.

## Setup Nginx

It is highly recommended to setup a reverse-proxy for Impequid. In this case we'll chose Nginx.

You need to setup a Nginx reverse proxy from `https://impequid.example.server:443` to `http://127.0.0.1:44400`.

## Get ReCaptcha

Just sign up [here](https://www.google.com/recaptcha). The steps should be fairly easy.

## Finish

That should be it! Enjoy your Impequid server!

## Troubleshooting

If you have any questions, feedback or just want to chat, feel free to join the [Gitter Chatroom](https://gitter.im/dodekeract/impequid).
