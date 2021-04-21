const { NodeSSH } = require('node-ssh');
let ssh = new NodeSSH();


const pipeStream = (stream, {stdout_cb, stderr_cb}) => {
    const {stdin, stdout, stderr} = process
    const {isTTY} = stdout

    if (isTTY && stdin.setRawMode) stdin.setRawMode(true)

    // stream.pipe(stdout)
    // stream.stderr.pipe(stderr)
    // stdin.pipe(stream)
    stream.on('data', (data) => {
        if(stdout_cb) stdout_cb(data);
    });
    stream.stderr.on('data', (data) => {
        if (stderr_cb) stderr.write(data);
    });
    stdin.on('data', (data) => stream.write(data));


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
    startSshStream: async function (stdout_cb, stderr_cb, {host, username, password}) {
        if (!ssh) {
            console.log('Stream already opened...');
            return;
        }

        await ssh.connect({
                   host: process.env.HOST     || host,
               username: process.env.USERNAME || username,
               password: process.env.PASSWORD || password,
               compress: true,
            tryKeyboard: true
        });


        await new Promise((resolve, reject) => {
            ssh.connection.shell({term: process.env.TERM || 'vt100'}, (err, stream) => {
                if (err) {
                    reject(err)
                    return
                }
                pipeStream(stream, {stdout_cb, stderr_cb})
                stream.on('close', () => resolve(true))
            })
        })

        if (ssh && ssh.dispose) {
            ssh.dispose()
        }
    },

    stopSshStream: function () {
        if (ssh && ssh.dispose) {
            ssh.dispose()
            ssh = null;
        }
    },

    stopSshStream: async function () {
        this.startSshStream();
        this.startSshStream()
    }
}