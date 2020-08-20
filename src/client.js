/* @flow */
let constants = require('./model/constants');

const net = require('net');
const Packet = require("../lib/model/packet");
require("./model/constants");
const {signData} = require("../lib/service/encryption_service");
const client = new net.Socket();
const port = 8080;
const host = '127.0.0.1';

client.connect(port, host, function() {
    console.log('Connected');
    client.write(`headers\nHello From Client ${client.address().address}\nHello From Client ${client.address().address}`);
});

client.on('data', function(data) {
    console.log(`Data received from server: ${data.toString()}.`);

    let received = new Packet(data)

    if(received.header === constants.END_OF_FILE_REACHED) {
        console.log('File has been successfully transmitted.')
    }

    if(received.header.includes(constants.LINE_RETRIEVED)) {
        let num = received.header.substr(received.header.indexOf(':')+1, received.header.size)
        let k = parseInt(num)
        console.log(`${k}: ${received.header.body}`)
        grabNextLine(k)
    }

    if(received.header === constants.CONNECTION_INITIATED) {
        grabNextLine(0);
    }

});

client.on('close', function() {
    console.log('Connection closed');
});

function signBody(body: string): string {
    return signData(body);
}

function grabNextLine(k: number) {
    let header = constants.TRANSMIT_FILE;
    let body = `${constants.READ_LINE}:${k+1},${constants.FILENAME}:secret_message.txt`;
    let signature = signBody(body)

    let request = new Packet(header, body, signature);

    client.write(request.toString())
}