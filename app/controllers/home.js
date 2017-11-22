angular.module('MyApp')
    .controller('HomeCtrl', function ($scope, $rootScope, Client, Note) {
        init();

        function init() {
            $scope.filterNote = {
                text: "",
                created_at: ""
            };
            $scope.date = new Date();
            $scope.minDate = new Date('01/01/2017');
            $scope.newMessage = "";
            $scope.newClient = "";
            $scope.searchClient = "";
            $scope.notes = [];
            Client.listClients()
                .then(function (response) {
                    $scope.clients = response.data.clients;
                    $scope.listNotes($scope.clients[0].id);
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }

        $scope.listNotes = function (id) {

            $scope.currentClient = $scope.clients
                .filter(function (client) {
                    return client.id === id;
                })[0];
            Note.listNotes(id)
                .then(function (response) {
                    $scope.notes = response.data.notes;
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });

        };

        $scope.saveClient = function () {
            if ($scope.newClient !== undefined && $scope.newClient.replace(/\s+/g, "") !== "") {
                Client.saveClient({name: $scope.newClient})
                    .then(function (response) {
                        $scope.clients.push(response.data.client);
                        $scope.newClient = "";
                        $('#newClient').modal('hide');
                        $scope.messages = {
                            success: [{msg: response.data.client.name + " was successfully added"}]
                        };
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        };
        $scope.addNote = function () {
            if ($scope.newMessage !== undefined && $scope.newMessage.replace(/\s+/g, "") !== "") {
                Note.saveNote({text: $scope.newMessage, client_id: $scope.currentClient.id})
                    .then(function (response) {
                        $scope.notes.push(response.data.note);
                        $scope.newMessage = "";
                        $scope.messages = {
                            success: [{msg: "Note was successfully added at " + moment(response.data.note.created_at).format('DD/MM/YYYY, H:mm:ss')}]
                        };
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        };

        $scope.setFilterDate = function () {
            console.log( moment($scope.date).format('YYYY-MM-DD'));
            $scope.filterNote.created_at = moment($scope.date).format('YYYY-MM-DD');
        };

        $scope.showPickaDate = function () {
            $(".pickadate-container").show();
        };

        $scope.hidePickaDate = function () {
            $(".pickadate-container").hide();
        };

    });
