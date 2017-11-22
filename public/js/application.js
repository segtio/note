angular.module('MyApp', ['ngRoute', 'satellizer', 'pickadate'])
    .config(["$routeProvider", "$locationProvider", "$authProvider", function ($routeProvider, $locationProvider, $authProvider) {
        loginRequired.$inject = ["$location", "$auth"];
        skipIfAuthenticated.$inject = ["$location", "$auth"];
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/note/:id', {
                templateUrl: 'partials/note.html',
                controller: 'NoteCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/contact', {
                templateUrl: 'partials/contact.html',
                controller: 'ContactCtrl'
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignupCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .when('/account', {
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/forgot', {
                templateUrl: 'partials/forgot.html',
                controller: 'ForgotCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .when('/reset/:token', {
                templateUrl: 'partials/reset.html',
                controller: 'ResetCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .otherwise({
                templateUrl: 'partials/404.html'
            });

        $authProvider.loginUrl = '/login';
        $authProvider.signupUrl = '/signup';
        $authProvider.google({
            url: '/auth/google',
            clientId: '645038852306.apps.googleusercontent.com'
        });

        function skipIfAuthenticated($location, $auth) {
            if ($auth.isAuthenticated()) {
                $location.path('/');
            }
        }

        function loginRequired($location, $auth) {
            if (!$auth.isAuthenticated()) {
                $location.path('/login');
            }
        }
    }])
    .run(["$rootScope", "$window", function ($rootScope, $window) {
        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }
    }]);

angular.module('MyApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MyApp')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MyApp')
  .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/login');
    };
  }]);

angular.module('MyApp')
    .controller('HomeCtrl', ["$scope", "$rootScope", "$location", "Client", "Note", function ($scope, $rootScope, $location, Client, Note) {
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
    }]);

angular.module('MyApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MyApp')
    .controller('NoteCtrl', ["$scope", "$rootScope", "$routeParams", "Note", function ($scope, $rootScope, $routeParams, Note) {

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
    }]);

angular.module('MyApp')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      Account.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      Account.changePassword($scope.profile)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      Account.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('MyApp')
  .controller('ResetCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);

angular.module('MyApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('MyApp')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  }]);
angular.module('MyApp')
    .factory('Client', ["$http", function ($http) {
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
    }]);
angular.module('MyApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
angular.module('MyApp')
    .factory('Note', ["$http", function ($http) {
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
    }]);