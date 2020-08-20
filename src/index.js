/* @flow */
'use strict'

const net = require('net');
let Packet = require('./model/packet.js')
const {validateSignature} = require("./service/signature_helper");

let constants = require('./model/constants');
const readline = require("readline");
const fs = require("fs");
const path = require('path')

const port = 8080;

const server = new net.Server();

const HELLO_RESPONSE = new Packet('CONNECTION_INITIATED', 'Hello!', 'xxxx');
const BLANK_RESPONSE = new Packet('xxxx', 'xxxx', 'xxxx')
const SIGNATURE_VAL_FAILED_RESPONSE = new Packet('SIGNATURE_VALIDATION_FAILURE', 'Signature did not match body.', 'xxxx')

function runServer() {
    if(!server.listening) {
        server.listen(port, function () {
            console.log(`Server listening for connection requests on socket localhost:${port}.`);
        });

        server.on('connection', function (socket) {
            console.log('A new connection has been established.');

            socket.write(HELLO_RESPONSE.toString());

            // The server can also receive data from the client by reading from its socket.
            socket.on('data', function (chunk) {
                console.log(`Data received from client: ${chunk.toString()}.`);
                handleRequests(chunk, socket);
            });

            socket.on('end', function () {
                console.log('Closing connection with the client');
            });

            socket.on('error', function (err) {
                console.log(`Error: ${err}`);
            });
        });
    }
}

runServer();

function handleRequests(incomingData: Buffer, socket: Object) {
    let request = new Packet(incomingData);

    if(!securityCheck(request)) {
        return SIGNATURE_VAL_FAILED_RESPONSE
    }

    if(request.header === constants.TRANSMIT_FILE) {
        let map = new Map(request.body.split(',').map(s => s.split(':')))
        let file = map.get(constants.FILENAME)
        let lineNum = map.get(constants.READ_LINE)

        readLine(lineNum, file, socket)
    }
}

function securityCheck(request: Packet): boolean {
    return validateSignature(request.body, request.signature);
}

function readLine(lineNum: number, file: string, socket) {
    seek(lineNum, file, function(err, line) {
        if(err) {
            if(typeof err === RangeError){
                let packet = new Packet(`${constants.END_OF_FILE_REACHED}`, `End of file (lineNum = ${lineNum}) has been reached.`, 'xxxx');
                socket.write(packet.toString());
            } else {
                throw err;
            }
        }
        let packet = new Packet(`${constants.LINE_RETRIEVED}:${lineNum}`, line, 'xxxx');
        socket.write(packet.toString());
    });
}

function seek(lineNumber, filename, callback) {
    let filePath = path.join(__dirname,'resources',filename)
    fs.readFile(filePath, function (err, data) {
        if (err) throw err;

        let lines = data.toString('utf-8').split("\n");

        if(+lineNumber > lines.length){
            return callback(new RangeError('File end reached without finding line'), null);
        }

        callback(null, lines[+lineNumber]);
    });
}

module.exports.runServer = runServer;
module.exports.securityCheck = securityCheck;
module.exports.handleRequests = handleRequests;