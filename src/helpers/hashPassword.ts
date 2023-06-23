// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

// Function to hash a password
export const hashPassword = (password) => {
  const secret = process.env.SECRET;

  // Generate a hash using the pbkdf2Sync function
  const hash = crypto
    .pbkdf2Sync(password, secret, 1000, 64, 'sha512')
    .toString('hex');

  return hash;
};
