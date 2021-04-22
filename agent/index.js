const WebSocketService = require('./lib/websocket');
const { ConfigurationService } = require('./lib/services');
const SshStreamInstance = require('./lib/ssh');

// Main
(async () => {
    // Load Configuration
    ConfigurationService.loadConfiguration();

    // get and validate host credentails for SSH
    const { host, username, password } = ConfigurationService.getHostCredentials();

    // Start WebSocket Server
    WebSocketService.startWebSocketServer({ port: 3000 });

    // SshStreamInstance
    await SshStreamInstance.startSshStream
    (
        { host, username, password },
        (stdout) => {
            process.stdout.write(stdout);
            WebSocketService.sendMessage(stdout.toString());
        },
        (stderr) => {
            process.stderr.write(stderr);
            WebSocketService.sendMessage(stderr.toString());
        }
    );

    WebSocketService.shutdownApplication();
})();

// for graceful shutdown
process.on('SIGINT', () => {
    WebSocketService.shutdownApplication();
});
