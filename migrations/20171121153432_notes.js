exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('notes', function (table) {
            table.increments();
            table.string('text').notNullable();
            table.integer('client_id').references('id').inTable('clients');
            table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('notes')
    ])
};
