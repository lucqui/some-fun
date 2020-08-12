const net = require('net');
const assert = require("assert");
const {runServer} = require("../lib");

const host = '127.0.0.1';
const port = 8080;

const testClient = new net.Socket();

describe('Test tcp server connects to a client', function () {
    runServer();

    it('Should reply with some err message if any', function (done) {
        testClient.connect(port, host, function () {});

        // When data is returned from server
        testClient.on('data', function(data) {
            assert(data.toString().includes('CONNECTION_INITIATED'));
            testClient.end();
            done();
        });

    });

});

//TODO: write happy-path unit tests for each method in server (index.js)