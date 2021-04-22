
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");

const EVENT_CALLBACKS = {};
const ALL_SOCKETS = [];

const io = new Server({
    serveClient: false,
    // below are engine.IO options
    pingInterval: 5000,
    pingTimeout: 5000,
    cookie: false
});


function createMessage(type, message = {}) {
    return {
      type: type,
      message: message
    }
}
createMessage('');

class MessageEvent {
    type = '';
    message = null;
    clientId = '';

    callbackForSendToClient = null;
    callbackForBroadcastToAll = null;

    constructor(data, clientId, callbackForSendToClient = null, callbackForBroadcastToAll = null) {
        this.type = data.type;
        this.message = data.message;
        this.clientId = clientId;

        this.callbackForSendToClient = callbackForSendToClient;
        this.callbackForBroadcastToAll = callbackForBroadcastToAll;
    }

    getType() {
        return this.type;
    }

    getMessage() {
        return this.message;
    }

    getClientId() {
        return this.clientId;
    }

    sendToClient(type, message) {
        if (this.callbackForSendToClient) {
            this.callbackForSendToClient(type, message);
        }
    }

    broadcastToAll(type, message) {
        if (this.callbackForBroadcastToAll) {
            this.callbackForBroadcastToAll(type, message)
        }
    }

}

module.exports = {
    WS_EVENTS: {
        'MESSAGE': 'message',
    
        'GET_INFO': 'GET_INFO',
        'GET_HEALTH': 'GET_HEALTH',
        'EXECUTE_COMMAND': 'EXECUTE_COMMAND',
        'TERMINAL_OUTPUT': 'TERMINAL_OUTPUT',
    
        'START_SSH_STREAM': 'START_SSH_STREAM',
        'STOP_SSH_STREAM': 'STOP_SSH_STREAM',
        'OPEN_SSH_STREAM': 'OPEN_SSH_STREAM',
        'MSG_SSH_STREAM': 'MSG_SSH_STREAM',
    
        'SHUTDOWN_APPLICATION': 'SHUTDOWN_APPLICATION'
    },

    startWebSocketServer: function ({port, path}) {
        const PORT = process.env.WEBSOCKET_PORT || port || 3000;
        const PATH = path || '/ws';

        io.on('connection', async (client) => {
            this.onClientConnection(client)
            client.on('disconnect', (msg) => this.onClientDisconnection(client, msg));
        });

        io.listen(PORT, {path: PATH});

        // Registering listeners
        const WebSocketListeners = require('./listeners');

        console.log('******************************************');
        console.log('WebSocket Server started on PORT -', PORT);
        console.log('******************************************\n');
    },

    stopWebSocketServer: function (cb) {
        io.close(cb);
    },

    shutdownApplication: function () {
        console.log('\nStopping application...');
        this.stopWebSocketServer();
        process.exit(0);
    },

    onEvent(key, callback) {
        if ((typeof key === 'string') && (key.length > 0) && (typeof callback === 'function')) {
          if (Array.isArray(EVENT_CALLBACKS[key])) {
            EVENT_CALLBACKS[key].push(callback);
          } else {
            EVENT_CALLBACKS[key] = [callback];
          }
        }
    },

    sendToCallbacks(messageEvent) {
        const { type, message } = messageEvent;
        if (Array.isArray(EVENT_CALLBACKS[type])) {
          EVENT_CALLBACKS[type].forEach(callback => {
              setTimeout(() => {
                  callback(messageEvent);
              }, 0);
          })
        } else {
          EVENT_CALLBACKS[type] = [];
        }
    },

    onClientConnection(client) {
        client.uuid = uuidv4();
        // console.log('New Client - ', client.uuid);

        ALL_SOCKETS.push(client);

        client.on('message', (data) => {
            const callbackForSendToClient   = async (type, message) => client.emit(type, message);
            const callbackForBroadcastToAll = async (type, message) => io.emit(type, message);

            const messageEvent = new MessageEvent(data, client.uuid, callbackForSendToClient, callbackForBroadcastToAll);
            // console.log('Message Received from UI - ' + messageEvent.getMessage());

            this.sendToCallbacks(messageEvent);
        });
    },

    onClientDisconnection(client, msg) {
        const index = ALL_SOCKETS.findIndex(item => item.uuid === client.uuid);
        ALL_SOCKETS.splice(index, 1);
    },

    onClientError(error) {
        // console.log('Client error - ', error);
    },

    broadcastToAll(type, message) {
        io.emit(type, message);
    },

    sendMessageById: function (id, key, message = null) {
        for (let i = 0; i < ALL_SOCKETS.length; i++) {
            const client = ALL_SOCKETS[i];
            if (client.uuid === id) {
                client.emit(key, message);
                break;
            }
        }
    }

}


