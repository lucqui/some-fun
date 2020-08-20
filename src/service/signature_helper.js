/* @flow */
const crypto = require("crypto")

const sharedSecret = 'some-secret-key-xxxx';

function signData(dataToSign: string):string {
    return crypto.createHmac("sha256", sharedSecret).update(dataToSign).digest("hex").toString();
}

module.exports.signData = signData

module.exports.validateSignature = function (data: string, signedData: string): boolean {
    return signData(data) === signedData
}