const path = require('path');

const yargs = require('yargs');
const dotenv = require('dotenv');

const DOTENV_FILENAME = '.env';

module.exports = {
    loadConfiguration: function () {
        dotenv.config({
            path: path.join(process.cwd(), DOTENV_FILENAME)
        });
    },

    getHostCredentials: function () {
        let { host, username, password } = yargs.argv;
        host = process.env.HOST || host;
        username = process.env.USERNAME || username;
        password = process.env.PASSWORD || password;

        if (!(host && username && password)) {
            console.log('ERROR: One or more Mandatory parameter/s (host, username, password) is/are missing.');
            process.exit(0);
        }

        return { host, username, password }
    }
}