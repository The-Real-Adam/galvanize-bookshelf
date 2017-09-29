
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments()
    table.varchar('first_name', 255).notNullable().defaultTo('')
    table.varchar('last_name', 255).notNullable().defaultTo('')
    table.varchar('email', 255).notNullable().unique()
    table.specificType('hashed_password', 'CHAR(60)').notNullable()
    table.timestamps(true,true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
