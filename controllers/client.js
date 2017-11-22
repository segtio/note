var Client = require('../models/Client');


exports.saveClient = function (req, res, next) {

    req.assert('name', 'Name cannot be blank').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }
    new Client({
        name: req.body.name,
        user_id: req.user.id
    }).save().then(function (client) {
        res.send({client: client});
    }).catch(function (err) {
        return res.status(400).send({msg: 'Data Insert Error : ' + err.message});
    });
};

exports.allClients = function (req, res, next) {

    Client.where({user_id: req.user.id}).fetchAll()
        .then(function (clients) {
            res.send({clients: clients});
        })
        .catch(function (err) {
            return res.status(400).send({msg: 'Data List Error : ' + err.message});
        });

};