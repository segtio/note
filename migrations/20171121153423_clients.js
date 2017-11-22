exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('clients', function (table) {
            table.increments();
            table.string('name').notNullable();
            table.integer('user_id').references('id').inTable('users');
            table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('clients')
    ])
};
