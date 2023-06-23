// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export const generateAuthToken = (id: string) => {
  const secret = process.env.SECRET;
  const bufferSecret = Buffer.from(secret, 'base64');
  const expiration = '1h';
  return jwt.sign({ id }, bufferSecret, { expiresIn: expiration });
};
