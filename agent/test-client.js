const io = require('socket.io-client');

const ENDPOINT = 'http://localhost:3000';

const WS_EVENTS = {
    'GET_INFO': 'GET_INFO',
    'GET_HEALTH': 'GET_HEALTH',
    'EXECUTE_COMMAND': 'EXECUTE_COMMAND',
    'TERMINAL_OUTPUT': 'TERMINAL_OUTPUT',
    'STOP_SSH_STREAM': 'STOP_SSH_STREAM',
    'SHUTDOWN_APPLICATION': 'SHUTDOWN_APPLICATION'
};

const socket = io.connect(ENDPOINT, {
    path: '/ws',
    reconnect: true
});

socket.on('connect', function (socket) {
    console.log('[connect] connect!');    
});

socket.on('disconnect', function (error) {
    console.log('[disconnect] disconnect - ', error);    
});

socket.on('message', (message) => {
    console.log('Message from server: ', message);
});

socket.on(WS_EVENTS.TERMINAL_OUTPUT, (message) => {
    message = JSON.parse(message);
    process.stdout.write(message)
});


// socket.emit(WS_EVENTS.SHUTDOWN_APPLICATION, 'Hello world!');
