/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('items', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('location').notNullable();
      table.string('difficulty').notNullable();
      table.string('type').notNullable();
    });
  };
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function(knex) {
    return knex.schema.dropTable('items');
  };
