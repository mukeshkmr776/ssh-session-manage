const { v4: uuidv4 } = require('uuid');
const WebSocketService = require('../websocket');

const SESSIONS = {};


module.exports = {
    createNewSession: function (host, client_id) {
        const ssh_uuid = this.addSession(host, client_id);
        return ssh_uuid;
    },

    isStreamAlreadyAvailable: function (host) {
        if (SESSIONS[host] !== undefined) {
            return true
        } else {
            return false
        }
    },

    getSessionByHost: function (host) {
        return SESSIONS[host] || null;
    },

    getSessionById: function (ssh_uuid) {
        for (const host in SESSIONS) {
            if (SESSIONS[host].ssh_uuid === ssh_uuid) {
                return SESSIONS[host];
            }
        }
        return null;
    },

    addSession: function (host, client_id) {
        const ssh_uuid = uuidv4();
        SESSIONS[host] = {
            ssh_uuid   : ssh_uuid,
            client_ids : [client_id]
        };

        return ssh_uuid;
    },


    addClientIntoExistingSession: function (host, client_id) {
        const session = this.getSessionByHost(host);
        if (session && !session.client_ids.includes(client_id)) {
            session.client_ids.push(client_id);
        }

        const {ssh_uuid} = session;
        this.sendMessageToClientById(client_id, {ssh_uuid});
    },

    sendStream: function (ssh_uuid, data) {
        const session = this.getSessionById(ssh_uuid);
        if (session && session.client_ids) {
            session.client_ids.forEach(client_id => {
                setTimeout(() => {
                    WebSocketService.sendMessageById(client_id, WebSocketService.WS_EVENTS.MSG_SSH_STREAM, data);
                })
            });
        }
    },

    sendMessageToClientById: function (client_id, message) {
        setTimeout(() => {
            WebSocketService.sendMessageById(client_id, WebSocketService.WS_EVENTS.OPEN_SSH_STREAM, message);
        })
    },

    closeSession: function (ssh_uuid) {
        const session = this.getSessionById(ssh_uuid);

        if (session) {
            if (session.client_ids) {
                session.client_ids.forEach(client_id => {
                    setTimeout(() => {
                        WebSocketService.sendMessageById(client_id, WebSocketService.WS_EVENTS.STOP_SSH_STREAM, '');
                    })
                });
            }
            this.deleteSessionById(ssh_uuid);
        }
    },

    deleteSessionById: function (ssh_uuid) {
        Object.keys(SESSIONS).forEach((host) => {
            if (SESSIONS[host].ssh_uuid === ssh_uuid) {
                delete SESSIONS[host];
            }
        });
    }
}