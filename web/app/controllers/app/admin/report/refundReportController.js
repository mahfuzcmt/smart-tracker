'use strict';

define(['app'], function (app) {
	
	var refundReportController = function (growl, $routeParams, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService, loadService) {

		var promis;
		$scope.itemsPerPage;
		$scope.currentPage = 1;
		$scope.pageDataBegin = 0;
		$scope.pageDataEnd = 0;
		$scope.pageDataTotal = 0;
		$scope.pageItemText = "";
		$scope.maxPaginationSize = 5;
		$scope.dataList = [];
		$scope.displayedCollection = [];
		$scope.itemsPerPage = 20;

		$scope.getData = function (param) {
			var paramString = "?adminId="+$scope.userInfo.id+"&token="+$scope.userInfo.authToken;
			if(!param.fromDate !== "" && !angular.isNull(param.fromDate)){
				paramString += "&fromDate="+param.fromDate;
			};
			if(param.toDate !== "" && !angular.isNull(param.toDate)){
				paramString += "&toDate="+param.toDate;
			};
			if(param.counterId !== "" && !angular.isNull(param.counterId)){
				paramString += "&counterId="+param.counterId;
			};
			window.open(constantService.baseUrl+"/ticketCounter/getCounterWiseReversedReport"+paramString);
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

	 	var init = function () {
			ngProgress.start();
			$scope.userInfo = authorizationService.getUserInfo();
			$scope.obj = {};
			$scope.obj.fromDate = moment(new Date()).format("YYYY-MM-DD");
			$scope.obj.toDate = moment(new Date()).format("YYYY-MM-DD");
			loadCounterList();
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('refundReportController', ['growl', '$routeParams', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'loadService',
    refundReportController]);
   
	
});

