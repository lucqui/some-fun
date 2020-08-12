/* @flow */
const crypto = require("crypto")
const fs = require('fs')

const signer = crypto.createSign('RSA-SHA256');
const verifier = crypto.createVerify('RSA-SHA256')

module.exports.signData = function (dataToSign: string): string {
    signer.update(dataToSign)
    return signer.sign(getPrivateKey(), 'base64').toString()
}

module.exports.validateSignature = function (data: string, signedData: string): boolean {
    verifier.update(data)
    return verifier.verify(getPublicKey(), signedData, 'base64')
}

function getPrivateKey(): string {
    let tmp = fs.readFileSync('./keys/public.pem', 'base64').toString();
    return tmp.substring(tmp.indexOf("\n"), tmp.lastIndexOf("\n"));
    // return tmp;
}

function getPublicKey(): string {
    let tmp = fs.readFileSync('./keys/private.pem', 'base64').toString();
    // return tmp.substring(tmp.indexOf("\n"), tmp.lastIndexOf("\n"));
    return tmp
}