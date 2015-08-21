module.exports = {
    experience: {
		io: require('./modules/socket').io,
        router: require('./modules/http').app,
        init: function () {

        }
    }
}
