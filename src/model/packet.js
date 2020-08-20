/* @flow */

let assert = require('assert');

class Packet {
    header: string;
    body: string;
    signature: string;

    constructor(header: string, body: string, signature: string) {
        if(typeof body === 'undefined' && typeof signature === 'undefined') {
            [header, body, signature] = header.toString().split('\n')
        }
        this.header = header;
        this.body = body;
        this.signature = signature;
    }

    toString(): string {
        return `${this.header}\n${this.body}\n${this.signature}`;
    }
}

module.exports = Packet;