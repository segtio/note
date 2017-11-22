var bookshelf = require('../config/bookshelf');
var User = require('./User');
var Note = require('./Note');

var Client = bookshelf.Model.extend({
    tableName: 'clients',
    hasTimestamps: true,
    notes: function() {
        return this.hasMany(Note);
    },
    user: function() {
        return this.belongsTo(User);
    }
});

module.exports = Client;
