const { generateHashedPassword, generateSalt } = require('../../src/authentication/password-hasher.js');

exports.seed = async function(knex) {
  // Delete all existing entries
  await knex('users').del();

  // Hash the password
  const plainTextPassword = 'password123';
  const salt = generateSalt();
  const hashedPassword = generateHashedPassword(plainTextPassword, salt);

  // Insert a test user
  await knex('users').insert([
    { username: 'bingus', password: hashedPassword, salt: salt }
  ]);
};
