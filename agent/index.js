const WebSocketService = require('./lib/websocket');
const { ConfigurationService } = require('./lib/services');

// Main
(async () => {
    // Load Configuration
    ConfigurationService.loadConfiguration();

    // get and validate host credentails for SSH
    // const { host, username, password } = ConfigurationService.getHostCredentials();

    // Start WebSocket Server
    WebSocketService.startWebSocketServer({ port: 3000 });
})();

// for graceful shutdown
process.on('SIGINT', () => {
    WebSocketService.shutdownApplication();
});
