var bookshelf = require('../config/bookshelf');
var Client = require('./Client');

var Note = bookshelf.Model.extend({
    tableName: 'notes',
    hasTimestamps: true,
    client: function() {
        return this.belongsTo(Client);
    }
});

module.exports = Note;
