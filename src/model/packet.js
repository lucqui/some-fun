/* @flow */

let assert = require('assert');

class Packet {
    header: string;
    body: string;
    signature: string;

    constructor(header, body: string, signature: string) {
        if(body === null && signature === null) {
            let tmp = header.toString().split('\n');
            this(tmp[0], tmp[1], tmp[2])
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