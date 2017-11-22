angular.module('MyApp')
    .factory('Note', function ($http) {
        return {
            saveNote: function (data) {
                return $http.post('/note', data);
            },
            listNotes: function (id) {
                return $http.get('/note/' + id);
            },
            deleteNote: function () {
                return $http.delete('/note');
            },
            updateNote: function (data) {
                return $http.put('/note', data);
            }
        };
    });