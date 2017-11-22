angular.module('MyApp')
    .controller('HomeCtrl', function ($scope, $rootScope, $location, Client, Note) {
        function init() {
            $scope.newClient = "";
            $scope.searchClient = "";
            $scope.clients = [];
            Client.listClients()
                .then(function (response) {
                    $scope.clients = response.data.clients;
                    $rootScope.currentClient = response.data.clients[0];
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }

        $scope.listNotes = function (id) {
            $rootScope.currentClient = $scope.clients.find(function (client) {
                return client.id === id;
            });
            $location.path('/note/' + id);
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
        init();
    });
