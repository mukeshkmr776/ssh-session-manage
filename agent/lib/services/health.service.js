const SessionService = require('../session');

module.exports = {
    getHealth: function () {
        return SessionService.getAllSessions();
    },

    getHealthByHost: function (host) {
        return SessionService.getSessionByHost(host);
    }
}
