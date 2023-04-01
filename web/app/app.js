'use strict';

define(['services/utils/routeResolver'], function () {

    angular.isNull = function (val) {
        return angular.isUndefined(val) || val === null || val === ""
    };

    var app = angular.module('stApp', ['localization', 'ngRoute', 'ngAnimate', 'ngResource',
        'ngCookies', 'ui.bootstrap', 'ui', 'ui.select2', 'routeResolverServices',
        'underscore', 'ngProgress', 'ui.bootstrap.transition', 'angularFileUpload', 'ngBootstrap', 'angular-growl']);

    app.run(['$rootScope', '$route', '$http', '$location', 'constantService', 'localize', 'authorizationService',
        function ($rootScope, $route, $http, $location, constantService, localize, authorizationService) {

            var userInfo;
            $rootScope.messagePageLocation = 'app/partials/message.html';

            localize.setLanguage('en-US');

            $rootScope.$on("$routeChangeStart", function (oldPath, newPath) {
                $rootScope.pageTitle = newPath.$$route.title;
                $rootScope.isWeb = true;
                if (newPath.$$route == undefined || newPath.$$route.isWeb) {
                    $rootScope.layout = constantService.getWebLayout();
                    return;
                }
                userInfo = authorizationService.getUserInfo();
                if (userInfo === undefined || userInfo === null) {
                    $rootScope.layout = constantService.getWebLayout();
                    $location.path('/');
                    return;
                }
                $rootScope.isWeb = false;
                $rootScope.layout = constantService.getAppLayout();
            });

        }]);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider', '$compileProvider',
        '$filterProvider', '$provide', '$locationProvider', '$httpProvider', 'growlProvider',
        function ($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider,
                  $filterProvider, $provide, $locationProvider, $httpProvider, growlProvider) {

            growlProvider.globalTimeToLive(6000);
            growlProvider.globalPosition('bottom-right');
            growlProvider.globalReversedOrder(false);
            growlProvider.onlyUniqueMessages(true);
            growlProvider.globalDisableCountDown(true);
            growlProvider.globalDisableIcons(false);
            growlProvider.globalDisableCloseButton(false);

            app.register = {
                controller: $controllerProvider.register,
                //directive: $compileProvider.directive,
                filter: $filterProvider.register,
                //factory: $provide.factory,
                //service: $provide.service
            };

            // Provider-based service.
            app.service = function (name, constructor) {
                $provide.service(name, constructor);
                return (this);
            };

            // Provider-based factory.
            app.factory = function (name, factory) {
                $provide.factory(name, factory);
                return (this);
            };

            // Provider-based directive.
            app.directive = function (name, factory) {
                $compileProvider.directive(name, factory);
                return (this);
            };

            var route = routeResolverProvider.route;
            $routeProvider
                //page and controller name prefix,														dir path, 						title								isWeb
                .when('/', route.resolve('signin', 'app/admin/security/', 'Sign In', true))
                .when('/dashboard', route.resolve('dashboard', 'app/admin/dashboard/', 'Dashboard', false))

                .when('/userlist', route.resolve('userlist', 'app/admin/user_manage/', 'List of Users', false))
                .when('/user', route.resolve('user', 'app/admin/user_manage/', 'Add Users', false))
                .when('/user/:id', route.resolve('user', 'app/admin/user_manage/', 'Update Users', false))
                .when('/tnxhistory/:id', route.resolve('tnxhistory', 'app/admin/user_manage/', 'Update Users', false))

                .when('/staffs', route.resolve('staffs', 'app/admin/staff/', 'List of staffs', false))
                .when('/monitor', route.resolve('monitor', 'app/admin/staff/', 'Staff Monitor', false))
                .when('/staff', route.resolve('staff', 'app/admin/staff/', 'Add Staff', false))
                .when('/staff/:id', route.resolve('staff', 'app/admin/staff/', 'Update Staff', false))

                .when('/pesticides', route.resolve('pesticides', 'app/admin/pesticide/', 'List of Pesticide Dealers', false))
                .when('/pesticide', route.resolve('pesticide', 'app/admin/pesticide/', 'Add Pesticide Dealer', false))
                .when('/pesticide/:id', route.resolve('pesticide', 'app/admin/pesticide/', 'Update Pesticide Dealer', false))


                .otherwise({redirectTo: '/'});
        }]);

    return app;

});
