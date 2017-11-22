angular.module('MyApp')
    .controller('NoteCtrl', function ($scope, $rootScope, $routeParams, Note) {

        function init() {
            $scope.filterNote = {
                text: "",
                created_at: ""
            };
            $scope.date = new Date();
            $scope.minDate = new Date('01/01/2017');
            $scope.newMessage = "";
            $scope.notes = [];
            $scope.client_id = $routeParams.id;
            $scope.listNotes($scope.client_id);
        }

        $scope.listNotes = function (id) {
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

        $scope.addNote = function () {
            if ($scope.newMessage !== undefined && $scope.newMessage.replace(/\s+/g, "") !== "") {
                Note.saveNote({text: $scope.newMessage, client_id: $scope.client_id})
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
            console.log(moment($scope.date).format('YYYY-MM-DD'));
            $scope.filterNote.created_at = moment($scope.date).format('YYYY-MM-DD');
        };

        $scope.showPickaDate = function () {
            $(".pickadate-container").show();
        };

        $scope.hidePickaDate = function () {
            $(".pickadate-container").hide();
        };
        init();
    });
