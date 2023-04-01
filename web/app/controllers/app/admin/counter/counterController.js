'use strict';

define(['app'], function (app) {
	
	var counterController = function (growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService) {
		
		var promis;
		var parentPage = "counterlist";
		var objectId = null;
		var module = "ticketCounter";
		var roles = [];

		var loadCounter = function (id) {
			promis = apiService.get(module+'/getCounterById/'+id);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
					return;
				}
				$scope.obj = data.data;
				$scope.roles = angular.copy(roles);
				$scope.statusList = angular.copy(statusList);
				$scope.tripTypeList = angular.copy(tripTypeList);
			});
		};

		var statusList = [
			{key: "Active", value: "Active"},
			{key: "Inactive", value: "Inactive"}
		];

		var tripTypeList = [
			{key: "Up", value: "Up"},
			{key: "Down", value: "Down"}
		];

		$scope.saveOrUpdate = function (obj) {
			if(objectId){
				promis = apiService.post(module+'/update', obj);
			}else{
				promis = apiService.post(module+'/save', obj);
			}
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
					return;
				}
				growl.success(data.message, {ttl: 3000});
				$scope.obj = {};
				if(objectId){
					$scope.backToPrevious();
				}
			});
		};

		$scope.backToPrevious = function(){
			navigationService.menuNavigation(parentPage);
		};

	 	var init = function () {
			ngProgress.start();
			$scope.btnName = "Save";
			if(!angular.isNull($routeParams.id)){
				$scope.btnName = "Update";
				objectId = $routeParams.id;
				loadCounter(objectId);
			}else{
				$scope.roles = angular.copy(roles);
				$scope.statusList = angular.copy(statusList);
				$scope.tripTypeList = angular.copy(tripTypeList);
			}
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('counterController', ['growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService',
		counterController]);
   
	
});

