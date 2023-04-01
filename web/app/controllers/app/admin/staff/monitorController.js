'use strict';

define(['app'], function (app) {

    var monitorController = function ($http, growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
                                      configurationService, ngProgress, apiService) {


        var promis;

        var initMap = function (locationLogs) {
            var myLatLng = {}
            angular.forEach(locationLogs, function (locationLog, key) {
                if (locationLog && locationLog.fullName) {
                    myLatLng.lat = locationLog.lat
                    myLatLng.lng = locationLog.lng
                }
            });
            var map = new google.maps.Map(document.getElementById("my-map"), {
                zoom: 12,
                center: myLatLng,
            });

            angular.forEach(locationLogs, function (locationLog, key) {
                if (locationLog && locationLog.fullName) {

                    var contentString =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        "</div>" +
                        '<h3 id="firstHeading" class="firstHeading">' + locationLog.fullName + ' <span class="charge-info">(Charge:' + locationLog.charge + ')</span></h3>' +
                        '<div id="bodyContent">' +
                        "<p><b>" + locationLog.designation + "</b>" +
                        "<p>" + locationLog.address + "" +
                        "<h4>" + locationLog.created + "</h4>" +
                        "</div>" +
                        "</div>";

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString,
                    });

                    var icon = {
                        url: locationLog.imagePath || "https://thumbs.dreamstime.com/z/businessman-avatar-image-beard-hairstyle-male-profile-vector-illustration-178545831.jpg",
                        scaledSize: new google.maps.Size(50, 50),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(0, 0)
                    };

                    var marker = new google.maps.Marker({
                        position: {lat : locationLog.lat, lng : locationLog.lng
                        },
                        map,
                        title: locationLog.fullName,
                        icon: icon,
                    });

                    marker.addListener("click", () => {
                        infowindow.open({
                            anchor: marker,
                            map,
                            shouldFocus: false,
                        });
                    });
                }
            });
        }

        var getLiveLoc = function () {
            var path = "location/liveLoc?tenantId=" + constantService.tracker_tenantId + "&token=" + $scope.userInfo.authToken
            $http({
                method: "GET",
                url: constantService.tracker_baseUrl + path
            }).then(function apiSuccess(response) {
                if (response.data.status === "error") {
                    growl.error(response.data.message, {ttl: 3000});
                } else {
                    if (response.data.status !== "success") {
                        growl.error("No data found", {ttl: 3000});
                    }
                    $scope.locationLogs = response.data.locationLogs
                    initMap($scope.locationLogs)

                }
            }, function apiError(response) {
                growl.error(response.message, {ttl: 3000});
            });
        };


        var loadUserList = function (obj) {
            var path = "user/getUsers?tenantId=" + constantService.tracker_tenantId
            $http({
                method: "POST",
                url: constantService.tracker_baseUrl + path,
                data: obj
            }).then(function apiSuccess(response) {
                if (response.data.status === "error") {
                    growl.error(response.data.message, {ttl: 3000});
                } else {
                    if(response.data.status !== "success"){
                        growl.error("No data found", {ttl: 3000});
                    }
                    $scope.userList = response.data.data
                    getLiveLoc();
                }
            }, function apiError(response) {
                growl.error(response.message, {ttl: 3000});
            });
        };

        var init = function () {
            ngProgress.start();
            $scope.userInfo = authorizationService.getUserInfo()
            $scope.isCollapsed = true;
            loadUserList();
            ngProgress.complete();
        };

        init();

    };

    app.register.controller('monitorController', ['$http', 'growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
        'localStorageService', 'configurationService', 'ngProgress', 'apiService',
        monitorController]);


});

