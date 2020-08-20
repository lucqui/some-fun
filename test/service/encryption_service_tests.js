const assert = require('assert');
const {signData, validateSignature} = require("../../lib/service/encryption_service");
const stringGenerator = require('randomstring')

describe('Verify signature after encryption', () => {
    let unsignedData = stringGenerator.generate(100);
    let signedData = signData(unsignedData);

    it('should verify signature correctly', () => {
        assert(validateSignature(unsignedData, signedData));
    })
});