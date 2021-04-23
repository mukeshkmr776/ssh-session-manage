const SshService = require('../ssh');
const WebSocketService = require('./index');
const { HealthService } = require('../services');

WebSocketService.onEvent(WebSocketService.WS_EVENTS.START_SSH_STREAM, async (messageEvent) => {
    const message = messageEvent.getMessage();
    const client_id = messageEvent.getClientId();
    const { host, username, password } = message;

    if (!(host && username && password)) {
        console.log('ERROR: One or more Mandatory parameter/s (host, username, password) is/are missing.');
        return;
    }
    SshService.startNewStream({ host, username, password }, client_id);
})


WebSocketService.onEvent(WebSocketService.WS_EVENTS.GET_HEALTH, (messageEvent) => {
    messageEvent.sendToClient(WebSocketService.WS_EVENTS.GET_HEALTH, HealthService.getHealth());
})

WebSocketService.onEvent(WebSocketService.WS_EVENTS.SHUTDOWN_APPLICATION, (messageEvent) => {
    console.log('\n\n------------------------------------------------------');
    WebSocketService.shutdownApplication();
})

module.exports;