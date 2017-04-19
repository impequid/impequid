# Impequid

[![Join the chat at https://gitter.im/dodekeract/impequid](https://badges.gitter.im/dodekeract/impequid.svg)](https://gitter.im/dodekeract/impequid?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Code Climate](https://codeclimate.com/github/dodekeract/impequid/badges/gpa.svg)](https://codeclimate.com/github/dodekeract/impequid)
[![NPM Downloads](https://img.shields.io/npm/dm/impequid.svg)](https://npmjs.com/package/impequid)
[![NPM Dependencies](https://david-dm.org/dodekeract/impequid.svg)](https://david-dm.org/dodekeract/impequid)
[![Gitter Chatroom](https://badges.gitter.im/dodekeract/impequid.svg)](https://gitter.im/dodekeract/impequid)

Impequid is a decentralized app-based cloud, which you can easily setup yourself. Apps are **completely separate** from Impequid, which means you can use every Impequid app, while it stores the data on your own server.

**Note that this is a really early release and most features are not available yet.**

## Basic Idea Behind Impequid

Impequid tries to solve a main problem of cloud-based services and apps: You can't use your own server.

If you use an Impequid-API based app, you can login with any Impequid server. If that app uses the `filesystem` API, it can use the files from your server and save them back to it, after it's finished.

This gives a lot of control back to the users and enables cheap cloud storage and competition between servers.

To make sure that all Impequid servers know about all Apps, there is an aditional server involved, that provides the app information. You can find it [here](https://github.com/dodekeract/impequid-service-provider). This is done to simplify maintaining an Impequid server.

In addition to that, [filesystem servers](https://github.com/dodekeract/impequid-filesystem-server) are also separate. That means that you can use an Impequid server hosted by somebody else, but still use your own server to store as many files as you want.

## Installation And Configuration

Here is a [Setup Guide](documentation/setup-guide.md) to get you started.

## Starting

- `npm run start`

## Documentation

The API Documentation can be found [here](documentation/api.md)

## License

See [here](documentation/license.md).
