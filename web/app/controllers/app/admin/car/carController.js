'use strict';

define(['app'], function (app) {
	
	var carController = function (growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService) {
		
		var promis;
		var parentPage = "carlist";
		var objectId = null;
		var module = "car";

		var loadCar = function (id) {
			promis = apiService.get(module+'/getCarById/'+id);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
					return;
				}
				$scope.obj = data.data;
				$scope.statusList = angular.copy(statusList);
			});
		};

		var statusList = [
			{key: "Active", value: "Active"},
			{key: "Inactive", value: "Inactive"}
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
			if (!angular.isNull($routeParams.id)) {
				$scope.btnName = "Update";
				objectId = $routeParams.id;
				loadCar(objectId);
			} else {
				$scope.statusList = angular.copy(statusList);
			}
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('carController', ['growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService',
		carController]);
   
	
});

