angular.module('MyApp')
    .factory('Client', function ($http) {
        return {
            saveClient: function (data) {
                return $http.post('/client', data);
            },
            listClients: function () {
                return $http.get('/client');
            },
            deleteClient: function () {
                return $http.delete('/client');
            },
            updateClient: function (data) {
                return $http.put('/client', data);
            }
        };
    });