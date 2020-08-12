/* @flow */
'use strict'

const net = require('net');
let Packet = require('./model/packet.js')
const {validateSignature} = require("./service/encryption_service");

const port = 8080;

const server = new net.Server();

const HELLO_RESPONSE = new Packet('CONNECTION_INITIATED', 'Hello!', 'xxxx');
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
                handleRequests(chunk);
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

function handleRequests(incomingData: Buffer) {
    let request = new Packet(incomingData);


    if(!securityCheck(request)) {
        return SIGNATURE_VAL_FAILED_RESPONSE
    }

    //TODO: if header says retrieveLine:{num},fileName:secret_message.txt :
    //Return response packet:
    //header (first line): retrievedLine:{num}
    //body: the line in the file
    //signature: xxxx

    //return EOF when num > fileLength:
    //header: END_OF_FILE_REACHED
    //body: The end of the file has been reached.
    //signature: xxxx

    return HELLO_RESPONSE;
}

function securityCheck(request: Packet): boolean {
    let canAccess = true;
    canAccess = canAccess && request.body.length > 0 && request.signature.length > 0;
    // canAccess = canAccess && validateSignature(request.body, request.signature);
    return canAccess;
}

module.exports.runServer = runServer;
module.exports.securityCheck = securityCheck;
module.exports.handleRequests = handleRequests;