exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments()

    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    table.integer('book_id')
      .notNullable()
      .references('id')
      .inTable('books')
      .onDelete('CASCADE')

    table.timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites')
}
