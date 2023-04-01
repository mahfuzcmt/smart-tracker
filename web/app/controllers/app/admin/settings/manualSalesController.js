'use strict';

define(['app'], function (app) {
	
	var manualSalesController = function (growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService, loadService) {
		
		var promis;
		var module = "ticketCounter";

		$scope.addSales = function (obj) {
			promis = apiService.post('ticket/sales/', obj);
			$scope.dataFound = false;
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
					return;
				}
				growl.success(data.message, {ttl: 3000});
			});
		};

		var loadUserList = function (respectiveCounterId) {
			loadService.showDialog();
			var obj = {
				adminId : $scope.userInfo.id,
				respectiveCounterId : respectiveCounterId,
				token: $scope.userInfo.authToken
			};
			promis = apiService.post('user/getUsers', obj);
			promis.then(function (data) {
				loadService.hideDialog();
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
				}
				$scope.userList = data.data;
			});
		};

		var loadCounterList = function () {
			loadService.showDialog();
			promis = apiService.post('ticketCounter/getCounters');
			promis.then(function (data) {
				loadService.hideDialog();
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
				}
				$scope.counterList = data.data;
			});
		};

		$scope.getRouteByCounterId = function (counterId) {
			promis = apiService.post('route/getRoutes', {colName : "counter.id", colValue: counterId});
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
				}
				$scope.routeList = data.data;
				loadUserList(counterId)
			});
		};

	 	var init = function () {
			ngProgress.start();
			$scope.obj = {};
			$scope.userInfo = authorizationService.getUserInfo();
			$scope.obj.dateTime = moment(new Date()).format("YYYY-MM-DD");
			loadCounterList();
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('manualSalesController', ['growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'loadService',
		manualSalesController]);
   
	
});

