const crypto = require("crypto");
// const sodium = require('sodium')
const fs = require('fs');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

console.log(`publicKey: [${publicKey.toString()}]. Give this to consumer.`)
fs.writeFileSync('keys/public.pem', publicKey)
console.log(`privateKey: [${privateKey.toString()}]. Keep this`)
fs.writeFileSync('keys/private.pem', privateKey)
