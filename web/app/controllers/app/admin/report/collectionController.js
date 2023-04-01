'use strict';

define(['app'], function (app) {

	var collectionController = function (growl, $routeParams, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
												 configurationService, ngProgress, apiService, loadService) {

		$scope.exportData = function (param) {
			var paramString = "?tenantId="+constantService.tenantId+"&adminId="+$scope.userInfo.id+"&token="+$scope.userInfo.authToken;
			if(!param.fromDate !== "" && !angular.isNull(param.fromDate)){
				paramString += "&fromDate="+param.fromDate;
			};
			if(param.toDate !== "" && !angular.isNull(param.toDate)){
				paramString += "&toDate="+param.toDate;
			};
			window.open(constantService.baseUrl+"/report/exportCollectionReport"+paramString);
		};

		var init = function () {
			ngProgress.start();
			$scope.userInfo = authorizationService.getUserInfo();
			$scope.obj = {};
			$scope.obj.fromDate = moment(new Date()).format("YYYY-MM-DD");
			$scope.obj.toDate = moment(new Date()).format("YYYY-MM-DD");
			ngProgress.complete();
		};

		init();

	};

	app.register.controller('collectionController', ['growl', '$routeParams', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
		'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'loadService',
		collectionController]);


});

