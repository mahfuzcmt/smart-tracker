'use strict';

define(['app'], function (app) {
	
	var userController = function (growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService) {
		
		var promis, roleList = [];
		var parentPage = "userlist";
		var objectId = null;
		var module = "user";
		var counters = [];

		var loadUser = function (id) {
			promis = apiService.get(module+'/getUserById/'+id);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
					return;
				}
				$scope.obj = data.data;
				$scope.statusList = angular.copy(statusList);
				$scope.roleList = angular.copy(roleList);
			});
		};

		var roleList = [
			{key: "Admin", value: "Admin"},
			{key: "User", value: "User"}
		];
		var statusList = [
			{key: "Active", value: "Active"},
			{key: "Inactive", value: "Inactive"}
		];


		$scope.saveOrUpdate = function (obj) {
			obj.token = $scope.userInfo.authToken;
			obj.adminId = $scope.userInfo.id;
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
			$scope.userInfo = authorizationService.getUserInfo();
			$scope.btnName = "Save";
			if(!angular.isNull($routeParams.id)){
				$scope.btnName = "Update";
				objectId = $routeParams.id;
				loadUser(objectId);
			}else{
				$scope.counters = angular.copy(counters);
				$scope.statusList = angular.copy(statusList);
				$scope.roleList = angular.copy(roleList);
				$scope.obj = {};
				$scope.obj.role = "User";
			}
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('userController', ['growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService',
		userController]);
   
	
});

