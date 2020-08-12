const net = require('net');
const client = new net.Socket();
const port = 8080;
const host = '127.0.0.1';

client.connect(port, host, function() {
    console.log('Connected');
    client.write(`headers\nHello From Client ${client.address().address}\nHello From Client ${client.address().address}`);
});

client.on('data', function(data) {
    console.log('Server Says : ' + data);
    //TODO while loop (k) on data send in request packet and log message from body of received packet:
    //the header (first line): retrieveLine:${k}
    //body: some random string
    //signature: sign(body)
    //
    //Waits for a response from server saying EOF
    //sends a close connection to server
});

client.on('close', function() {
    console.log('Connection closed');
});