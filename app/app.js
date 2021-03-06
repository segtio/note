angular.module('MyApp', ['ngRoute', 'satellizer', 'pickadate'])
    .config(function ($routeProvider, $locationProvider, $authProvider) {
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
    })
    .run(function ($rootScope, $window) {
        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }
    });
