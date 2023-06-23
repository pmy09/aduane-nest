// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

// Function to generate a JWT token
export const generateAuthToken = (id: string) => {
  const secret = process.env.SECRET;
  const bufferSecret = Buffer.from(secret, 'base64');
  const expiration = '1h';

  // Sign the payload (which includes the provided `id`) with the secret and set an expiration time
  return jwt.sign({ id }, bufferSecret, { expiresIn: expiration });
};
