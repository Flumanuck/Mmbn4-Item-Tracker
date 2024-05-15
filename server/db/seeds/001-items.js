const fs = require('fs');
const path = require('path');
const { ITEMS_TABLE } = require("../../global/global.js");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex(ITEMS_TABLE).del();

  // Read and parse the JSON file
  const filePath = path.resolve(__dirname, '../../src/mystery_data_api.json');
  const fileContents = fs.readFileSync(filePath, 'utf-8');

  const data = JSON.parse(fileContents);

  // Collect items using the recursive function
  const seedData = collectItems(data);

  // Inserts seed entries
  await knex(ITEMS_TABLE).insert(seedData);
};

function collectItems(data, difficulty = '', location = '', seedData = [], type = '') {
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    for (let key in data) {
      if (difficulty === '') {
        collectItems(data[key], key, location, seedData, type);
      } else if (location === '') {
        collectItems(data[key], difficulty, key, seedData, type);
      } else if (type === '') {
        collectItems(data[key], difficulty, location, seedData, key);
      } else {
        if (data[key] !== null) {
          collectItems(data[key], difficulty, location, seedData, type);
        }
      }
    }
  } else if (Array.isArray(data)) {
    for (const name of data) {
      seedData.push({
        name,
        location,
        difficulty,
        type,
      });
    }
  }
  return seedData;
}
