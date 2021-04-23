const { NodeSSH } = require('node-ssh');

const SessionService = require('../session');

const pipeStream = (stream, {stdout_cb = () => {}, stderr_cb = () => {}}) => {
    const {stdin, stdout, stderr} = process;
    const {isTTY} = stdout

    if (isTTY && stdin.setRawMode) stdin.setRawMode(true)

    // stream.pipe(stdout)
    // stream.stderr.pipe(stderr)
    // stdin.pipe(stream)
    stream.on('data',        (data) =>    stdout_cb(data.toString()));
    stream.stderr.on('data', (data) => stderr_cb(data.toString()));
    stdin.on('data',         (data) => stream.write(data.toString()));


    const onResize = isTTY && (() => stream.setWindow(stdout.rows, stdout.columns, null, null));

    if (isTTY) {
        stream.once('data', onResize)
        process.stdout.on('resize', onResize)
    }

    stream.on('close', () => {
        if (isTTY) {
            process.stdout.removeListener('resize', onResize)
        }

        stream.unpipe()
        stream.stderr.unpipe()
        stdin.unpipe()

        if (stdin.setRawMode) {
            stdin.setRawMode(false)
        }

        stdin.unref()
    })
}

module.exports = {
    startNewStream: function ({ host, username, password }, client_id) {
        let ssh_uuid = '';

        if (SessionService.isStreamAlreadyAvailable(host)) {
            SessionService.addClientIntoExistingSession(host, client_id);
            return;
        }

        this.createNewSshConnection
        (
            { host, username, password },
            () => { // On ssh connection open
                ssh_uuid = SessionService.createNewSession(host, client_id);
                SessionService.sendMessageToClientById(client_id, {ssh_uuid});
            },
            (stdout) => {
                SessionService.sendStream(ssh_uuid, stdout);
                process.stdout.write(stdout);
            },
            (stderr) => {
                SessionService.sendStream(ssh_uuid, stderr);
                process.stderr.write(stderr);
            },
            () => { // On ssh connection close
                SessionService.closeSession(ssh_uuid);
            },
        );
    
    },

    createNewSshConnection: async function (credentials, on_connect_cb = () => {}, stdout_cb = () => {}, stderr_cb = () => {}, on_close = () => {}) {
        const { host, username, password } = credentials;
        
        let ssh = new NodeSSH();

        if (!ssh) {
            console.log('Stream already opened...');
            return;
        }

        await ssh.connect({
                   host: host,
               username: username,
               password: password,
               compress: true,
            tryKeyboard: true
        });

        return new Promise((resolve, reject) => {
            ssh.connection.shell({term: process.env.TERM || 'vt100'}, (err, stream) => {
                if (err) {
                    reject(err)
                    return
                }

                setTimeout(() => {
                    on_connect_cb()
                });

                // pipe ssh stream to stdout/stderr
                pipeStream(stream, {stdout_cb, stderr_cb})

                stream.on('close', () => {
                    if (ssh && ssh.dispose) {
                        ssh.dispose()
                    }
                    on_close();
                })

                // resolve(ssh);
                resolve({ssh, stream});
            })
        })

        // if (ssh && ssh.dispose) {
        //     ssh.dispose()
        // }
    },

    stopSshStream: function () {
        // if (ssh && ssh.dispose) {
        //     ssh.dispose()
        //     ssh = null;
        // }
    }

}