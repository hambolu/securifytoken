const crypto = require('crypto');

// Define the encryption algorithm
const algorithm = 'aes-256-ctr';

/**
 * Generates a secure token based on the payload and secret key.
 * @param {Object} payload - The payload to be encrypted.
 * @param {string} secretKey - The secret key for encryption.
 * @param {Object} [options] - Options for encoding the token.
 * @param {string|number} [options.expiresIn] - The expiration time for the token (e.g., '1h' or 3600 for 1 hour).
 * @returns {string} - The generated token.
 */
function encode(payload, secretKey, options = {}) {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);

  // Create a cipher using the encryption algorithm and secret key
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

  // Encrypt the payload
  const encryptedPayload = Buffer.concat([cipher.update(JSON.stringify(payload)), cipher.final()]);

  // Combine the unique string, IV, and encrypted payload to form the token
  const token = `${generateUniqueString()}|${iv.toString('hex')}${encryptedPayload.toString('hex')}`;

  // Check if expiresIn option is provided
  if (options.expiresIn) {
    // Calculate the expiration time and add it to the token
    const expirationTime = calculateExpirationTime(options.expiresIn);
    token = `${token}|${expirationTime}`;
  }

  return token;
}

/**
 * Calculates the expiration time based on the 'expiresIn' option.
 * @param {string|number} expiresIn - The expiration time duration (e.g., '1h' or 3600 for 1 hour).
 * @returns {number} - The expiration time in seconds.
 */
function calculateExpirationTime(expiresIn) {
  if (typeof expiresIn === 'number') {
    // If expiresIn is already a number, assume it's in seconds
    return Math.floor(Date.now() / 1000) + expiresIn;
  } else if (typeof expiresIn === 'string') {
    // Parse the string duration (e.g., '1h' for 1 hour)
    const durationMatch = expiresIn.match(/^(\d+)([smhd])$/);
    if (durationMatch) {
      const [, value, unit] = durationMatch;
      const secondsInUnit = { s: 1, m: 60, h: 3600, d: 86400 };
      return Math.floor(Date.now() / 1000) + parseInt(value) * secondsInUnit[unit];
    }
  }

  // Default to no expiration time
  return 0;
}

/**
 * Decodes a token using the provided secret key.
 * @param {string} token - The token to be decoded.
 * @param {string} secretKey - The secret key for decryption.
 * @returns {Object} - The decoded payload.
 */
function decode(token, secretKey) {
  // Split the token into unique string, IV, and encrypted payload
  const [uniqueString, rest] = token.split('|');

  // Extract IV and encrypted payload
  const iv = Buffer.from(rest.slice(0, 32), 'hex');
  const encryptedPayload = Buffer.from(rest.slice(32), 'hex');

  // Create a decipher using the encryption algorithm and secret key
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);

  // Decrypt the payload
  const decryptedPayload = Buffer.concat([decipher.update(encryptedPayload), decipher.final()]);

  // Parse the decrypted payload as JSON
  return JSON.parse(decryptedPayload.toString());
}

/**
 * Verifies the authenticity of a token using the provided secret key.
 * @param {string} token - The token to be verified.
 * @param {string} secretKey - The secret key for verification.
 * @returns {boolean} - True if the token is valid, false otherwise.
 */
function verify(token, secretKey) {
  try {
    // Attempt to decode the token
    decode(token, secretKey);
    return true;
  } catch (error) {
    // Log an error message if token verification fails
    console.error('Token verification failed:', error.message);
    return false;
  }
}

/**
 * Generates a unique string of 8 characters.
 * @returns {string} - The generated unique string.
 */
function generateUniqueString() {
  const uniqueChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let uniqueString = '';
  
  // Generate a random 8-character string
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * uniqueChars.length);
    uniqueString += uniqueChars[randomIndex];
  }

  return uniqueString;
}

// Export the functions for external use
module.exports = { encode, decode, verify };
