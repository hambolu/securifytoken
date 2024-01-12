const chai = require('chai');
const customJwt = require('../src/index');

const { expect } = chai;

describe('Custom JWT Package', () => {
  const secretKey = 'test_secret_key';

  describe('encode, decode, and verify functions', () => {
    it('should encode, decode, and verify a valid token', () => {
      const payload = {
        userId: '123',
        username: 'test_user',
      };

      const token = customJwt.encode(payload, secretKey);

      expect(token).to.be.a('string');

      const decodedPayload = customJwt.decode(token, secretKey);
      expect(decodedPayload).to.deep.equal(payload);

      const isTokenValid = customJwt.verify(token, secretKey);
      expect(isTokenValid).to.equal(true);
    });

    it('should fail to verify an invalid token', () => {
      const invalidToken = 'invalid_token';

      const isTokenValid = customJwt.verify(invalidToken, secretKey);
      expect(isTokenValid).to.equal(false);
    });
  });
});
