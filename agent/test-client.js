const io = require('socket.io-client');

const ENDPOINT = 'http://localhost:3000';

const WS_EVENTS = {
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
};

function createMessage(type, message = {}) {
    return {
      type: type,
      message: message
    }
}

const socket = io(ENDPOINT, {
    path: '/ws',
    reconnect: true
});

socket.on('connect', function (socket) {
    // console.log('[connect] connect!');
});

socket.on('disconnect', function (error) {
    // console.log('[disconnect] disconnect - ', error);
});

socket.on('message', (message) => {
    console.log('Message from server: ', message);
});

socket.on(WS_EVENTS.OPEN_SSH_STREAM, (message) => {
    console.log('Message from OPEN_SSH_STREAM: ', message.ssh_uuid);
});

socket.on(WS_EVENTS.MSG_SSH_STREAM, (message) => {
    process.stdout.write(message)
});

socket.on(WS_EVENTS.STOP_SSH_STREAM, (message) => {
    console.log('---- CLOSED ----');
    socket.disconnect();
});


function openSSH() {
    const message = createMessage(WS_EVENTS.START_SSH_STREAM, {
        host: 'localhost',
        username: 'mukki',
        password: 'mukki'
    });

    socket.emit(WS_EVENTS.MESSAGE, message);
}

socket.connect();
openSSH()

process.on('SIGINT', () => {
    socket.close();
})