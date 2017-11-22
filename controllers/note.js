var Note = require('../models/Note');


exports.saveNote = function (req, res, next) {

    req.assert('client_id', 'client cannot be blank').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }
    new Note({
        text: req.body.text,
        client_id: req.body.client_id
    }).save().then(function (note) {
        res.send({note: note});
    }).catch(function (err) {
        return res.status(400).send({msg: 'Data Insert Error : ' + err.message});
    });
};

exports.allNotes = function (req, res, next) {
    Note.where({client_id: req.params.client_id}).fetchAll()
        .then(function (notes) {
            res.send({notes: notes});
        })
        .catch(function (err) {
            return res.status(400).send({msg: 'Data List Error : ' + err.message});
        });

};