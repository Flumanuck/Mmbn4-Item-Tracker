const crypto = require('crypto');

function generateSalt () {
  return crypto.randomBytes(6).toString('hex');
}

function generateHashedPassword (plainTextPassword, saltHex = null) {
  const salt = saltHex || generateSalt();
  const saltAndPassword = `${salt}${plainTextPassword}`
  const hash = crypto.createHash('sha256');
  const hashedPassword = hash.update(saltAndPassword).digest('hex');
  return hashedPassword;
}
function createSecretKey () {
  console.log(crypto.randomBytes(64).toString('hex'));
}

module.exports = {
  generateSalt,
  generateHashedPassword,
}