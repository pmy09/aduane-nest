// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

export const hashPassword = (password) => {
  const secret = process.env.SECRET;
  return crypto
    .pbkdf2Sync(password, secret, 1000, 64, 'sha512')
    .toString('hex');
};
