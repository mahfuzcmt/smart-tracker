'use strict';

define(['app'], function (app) {
	
	var pesticideController = function (growl, $routeParams, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService) {
		
		var promis, unionList = [], blockList = [];
		var parentPage = "pesticides";
		var objectId = null;
		var module = "pesticideDealer";
		var counters = [];

		var loadData = function (id) {
			promis = apiService.get(module+'/getById/'+id);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
					return;
				}
				$scope.obj = data.data;
				loadUnionList($scope.obj)
			});
		};

		var licenseTypeList = [
			{key: "Retail", value: "Retail"},
			{key: "Wholesale", value: "Wholesale"}
		];
		var statusList = [
			{key: "Active", value: "Active"},
			{key: "Inactive", value: "Inactive"},
			{key: "Expired", value: "Expired"}
		];


		$scope.saveOrUpdate = function (obj) {
			obj.token = $scope.userInfo.authToken;
			obj.adminId = $scope.userInfo.id;
			promis = apiService.post(module+'/add', obj);
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


		var loadUnionList = function (obj) {
			promis = apiService.get('geo/getUnionsByUpazila');
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				unionList = data.data
				$scope.loadBlockList(obj)
			});
		};

		$scope.loadBlockList = function (obj) {
			promis = apiService.post('geo/getBlocksByUnion', {unionId: obj.unionPorishodId});
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				blockList = data.data
				$scope.blockList = angular.copy(blockList)
				$scope.statusList = angular.copy(statusList);
				$scope.unionList = angular.copy(unionList);
				$scope.licenseTypeList = angular.copy(licenseTypeList);
			});
		};

	 	var init = function () {
			ngProgress.start();
			$scope.userInfo = authorizationService.getUserInfo();
			$scope.btnName = "Save";
			if(!angular.isNull($routeParams.id)){
				$scope.btnName = "Update";
				objectId = $routeParams.id;
				loadData(objectId);
			}else{
				$scope.obj = {};
				$scope.obj.role = "User";
				loadUnionList($scope.obj)
			}
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('pesticideController', ['growl', '$routeParams', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService',
		pesticideController]);
   
	
});

