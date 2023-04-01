'use strict';

define(['app'], function (app) {

    var staffController = function ($upload, $http, growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
                                    configurationService, ngProgress, apiService) {

        var parentPage = "staffs";
        var objectId = null;
        var module = "staff";

        var getStaff = function (id) {
            var path = "user/getUserById?tenantId=" + constantService.tracker_tenantId +"&id="+id
            $http({
                method: "GET",
                url: constantService.tracker_baseUrl + path
            }).then(function apiSuccess(response) {
                if (response.data.status === "error") {
                    growl.error(response.data.message, {ttl: 3000});
                } else {
                    if(response.data.status !== "success"){
                        growl.error("No data found", {ttl: 3000});
                    }
                    $scope.statusList = angular.copy(statusList);
                    $scope.obj = response.data.data
                }
            }, function apiError(response) {
                growl.error(response.message, {ttl: 3000});
            });
        };
        var statusList = [
            {key: "Active", value: "Active"},
            {key: "Inactive", value: "Inactive"}
        ];


        $scope.uploadPic = function (files) {
            //$scope.obj.imagePath = "";
            $scope.message = "";
            var path = "user/uploadPic?tenantId=" + constantService.tracker_tenantId
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.upload = $upload.upload({
                    url: constantService.tracker_baseUrl + path,
                    method: 'POST',
                    file: file
                }).success(function(data, status, headers, config) {
                    $scope.message = data;
                    //$scope.obj.imagePath = 'img/teacher/'+file.name;
                }).error(function(data, status) {
                    $scope.message = data;
                });
            };
        }


        $scope.saveOrUpdate = function (obj) {
            var operation = "save"
            if (objectId) {
                operation = "update"
            }
            var path = "user/" + operation + "?tenantId=" + constantService.tracker_tenantId

            $http({
                method: "POST",
                url: constantService.tracker_baseUrl + path,
                data: obj
            }).then(function apiSuccess(response) {
                if (response.data.status === "error") {
                    growl.error(response.data.message, {ttl: 3000});
                } else {
                    growl.success(response.data.message, {ttl: 3000});
                    $scope.obj = {};
                    if (objectId) {
                        $scope.backToPrevious();
                    }
                }

            }, function apiError(response) {
                growl.error(response.data.message, {ttl: 3000});
            });
        };

        $scope.backToPrevious = function () {
            navigationService.menuNavigation(parentPage);
        };


        var init = function () {
            ngProgress.start();
            $scope.btnName = "Save";
            if (!angular.isNull($routeParams.id)) {
                $scope.btnName = "Update";
                objectId = $routeParams.id;
                getStaff(objectId);
            } else {
                $scope.statusList = angular.copy(statusList);
            }
            ngProgress.complete();
        };

        init();

    };

    app.register.controller('staffController', ['$upload', '$http', 'growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
        'localStorageService', 'configurationService', 'ngProgress', 'apiService',
        staffController]);


});

