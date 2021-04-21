const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");

const { CommandService, InfoService, HealthService } = require('../services');
const SshStreamService = require('../ssh/ssh.service');

const io = new Server({
    serveClient: false,
    // below are engine.IO options
    pingInterval: 5000,
    pingTimeout: 5000,
    cookie: false
});

const WS_EVENTS = {
    'GET_INFO': 'GET_INFO',
    'GET_HEALTH': 'GET_HEALTH',
    'EXECUTE_COMMAND': 'EXECUTE_COMMAND',
    'TERMINAL_OUTPUT': 'TERMINAL_OUTPUT',
    'STOP_SSH_STREAM': 'STOP_SSH_STREAM',
    'SHUTDOWN_APPLICATION': 'SHUTDOWN_APPLICATION'
};

const OUTPUT_FILE = path.join(__dirname, 'temp.log');
const filrWriteStream = fs.createWriteStream(OUTPUT_FILE);

function writetoOutputFile(data) {
    filrWriteStream.write(data.toString());
}

function streamOutputFile() {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(OUTPUT_FILE)
        });

        rl.on('line', line => {
            line = '\n' + line.toString();
            io.emit(WS_EVENTS.TERMINAL_OUTPUT, JSON.stringify(line));
            rl.resume();
        });

        rl.on('close', () => {
            resolve();
        });
    })
}

function deleteOutputFile() {
    filrWriteStream.close();
    if (fs.existsSync(OUTPUT_FILE)) {
        fs.unlinkSync(OUTPUT_FILE);
    }
}

module.exports = {
    startWebSocketServer: function ({port, path}) {
        const PORT = process.env.WEBSOCKET_PORT || port || 3000;
        const PATH = path || '/ws';

        io.on('connect', (response) => {
            // console.log('Server connect');
        })

        io.on('connection', async (client) => {
            client.uuid = uuidv4();
            // console.log('Client connected - ', client.uuid);
            this.registerWsEvents(client);

            client.on('message', (message) => {
                console.log('Message received from client - ', message);
                client.send('Hi client!');
            });

            client.on('disconnect', () => {
                // console.log('Client disconnected - ', client.uuid);
            });

            await streamOutputFile(client);
        })

        io.listen(PORT, {path: PATH});
        console.log('******************************************');
        console.log('WebSocket Server started on PORT -', PORT);
        console.log('******************************************\n');
    },


    registerWsEvents: function (client) {
        client.on(WS_EVENTS.GET_INFO, InfoService.getInfo);
        client.on(WS_EVENTS.GET_HEALTH, HealthService.getHealth);
        client.on(WS_EVENTS.EXECUTE_COMMAND, CommandService.executeCommand);

        client.on(WS_EVENTS.STOP_SSH_STREAM, async () => {
            // todo
        });

        client.on(WS_EVENTS.SHUTDOWN_APPLICATION, () => {
            this.shutdownApplication();
        })
    },

    sendMessage: function (message) {
        writetoOutputFile(message)
        io.emit(WS_EVENTS.TERMINAL_OUTPUT, JSON.stringify(message));
    },

    stopWebSocketServer: function (cb) {
        io.close(cb);
    },

    shutdownApplication: function () {
        console.log('\nStopping application...');
        deleteOutputFile();
        SshStreamService.stopSshStream();
        this.stopWebSocketServer();
        process.exit(0);
    }

}