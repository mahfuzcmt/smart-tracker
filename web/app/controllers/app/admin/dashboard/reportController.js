'use strict';

define(['app'], function (app) {
	
	var reportController = function (growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService) {
		
		var promis;

		var loadUser = function (id) {
			$scope.userInfo = authorizationService.getUserInfo();
			if($scope.userInfo.role ==='user' ){
				return;
			}
			promis = apiService.get('user/getUserById/'+id);
			promis.then(function (data) {
				if(data.status != "success"){
					growl.error("No data found", {ttl: 3000});
					return;
				}
				$scope.obj = data.data;
			});
		};

		$scope.saveOrUpdate = function (obj) {
			promis = apiService.post('user/save', obj);
			if($routeParams.id){
				promis = apiService.put('user/update', obj);
			}
			promis.then(function (data) {
				if(data.status != "success"){
					growl.error(data.message, {ttl: 3000});
					return;
				}
				growl.error(data.message, {ttl: 3000});
				$scope.obj = {};
			});
		};

	 	var init = function () {
			ngProgress.start();
			$scope.btnName = "Save";
			if(!angular.isNull($routeParams.id)){
				$scope.btnName = "Update";
				loadUser($routeParams.id)
			}
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('reportController', ['growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService',
		reportController]);
   
	
});

