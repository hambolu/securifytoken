# SecurifyToken

SecurifyToken is a Node.js library for generating and verifying secure JSON Web Tokens (JWTs) with customizable encryption and decoding. It uses the AES-256-CTR encryption algorithm to provide a high level of security.

## Installation

Install the library using npm:

```bash
npm install securifytoken
```
### Usage
```bash
const securifyToken = require('securifytoken');

// Example payload
const payload = {
  userId: '123',
  username: 'example_user',
};

// Secret key
const secretKey = 'your_secret_key';

// Generate a token
const token = securifyToken.encode(payload, secretKey, { expiresIn: '1h' });

// Verify the token
const isTokenValid = securifyToken.verify(token, secretKey);

if (isTokenValid) {
  // Decode the token
  const decodedPayload = securifyToken.decode(token, secretKey);
  console.log('Decoded Payload:', decodedPayload);
} else {
  console.log('Token verification failed.');
}
```
### API
encode(payload, secretKey, options)

Generates a secure token based on the payload and secret key.

    payload (Object): The payload to be encrypted.
    secretKey (string): The secret key for encryption.
    options (Object): Options for encoding the token.
        expiresIn (string|number): The expiration time for the token (e.g., '1h' or 3600 for 1 hour).

Returns: The generated token.
decode(token, secretKey)

Decodes a token using the provided secret key.

    token (string): The token to be decoded.
    secretKey (string): The secret key for decryption.

Returns: The decoded payload.
verify(token, secretKey)

Verifies the authenticity of a token using the provided secret key.

    token (string): The token to be verified.
    secretKey (string): The secret key for verification.

Returns: true if the token is valid, false otherwise.
License

