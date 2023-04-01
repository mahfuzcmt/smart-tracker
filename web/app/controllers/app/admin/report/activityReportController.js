'use strict';

define(['app'], function (app) {
	
	var activityReportController = function (growl, $routeParams, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
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
			$scope.dataList = [];
			$scope.totalSuccess = 0;
			$scope.totalReversed = 0;
			$scope.totalSales = 0;

			var obj = {
				userId : $routeParams.id,
				adminId: $scope.userInfo.id,
				token: $scope.userInfo.authToken
			};
			if(!param.fromDate !== "" && !angular.isNull(param.fromDate)){
				obj.fromDate = param.fromDate;
			};
			if(param.toDate !== "" && !angular.isNull(param.toDate)){
				obj.toDate = param.toDate;
			};
			if(param.type !== "" && !angular.isNull(param.type)){
				obj.type = param.type;
			};
			if(param.counterId !== "" && !angular.isNull(param.counterId)){
				obj.counterId = param.counterId;
			};
			promis = apiService.post('report/getActivityReport', obj);
			loadService.showDialog();
			promis.then(function (data) {
				loadService.hideDialog();
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				paginate(data.operationLogList)
			});
		};

		var paginate = function(data, ){
			$scope.dataList = data;
			$scope.dataListSize = dataList.length;
			createWatches($scope.dataList);
		};

		$scope.search = function(filterText){
			var filteredResult = $filter("orderFilter")($scope.dataList, filterText);
            		$scope.dataListSize = filteredResult.length;
            		doPagination(filteredResult);
            		createWatches(filteredResult);
	     };

	     var doPagination = function(filteredResult){
        	 $scope.dataList = filteredResult;
			 $scope.pageDataTotal = filteredResult.length;
	        	if($scope.pageDataTotal === 0){
	        		$scope.pageDataBegin = 0;
	            	$scope.pageDataEnd = 0;
	    		} else {
	        		$scope.pageDataBegin = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
	            	$scope.pageDataEnd = $scope.pageDataBegin + $scope.itemsPerPage - 1;
	    		}

	        	if($scope.pageDataTotal !== 0 && $scope.pageDataEnd > $scope.pageDataTotal) {
	        		$scope.pageDataEnd = $scope.pageDataTotal
	        	}

	    		$scope.pageItemText = constantService.getPageItemText($scope.pageDataBegin, $scope.pageDataEnd,
								$scope.pageDataTotal, "Users", 'English');
	        };

		var createWatches = function (data) {
			$scope.$watch("searchText", function (filterText) {
				$scope.currentPage = 1;
			});

			$scope.$watch('currentPage + itemsPerPage', function() {
				var begin = (($scope.currentPage - 1) * $scope.itemsPerPage), end = begin + ($scope.itemsPerPage - 0);
				$scope.dataList = data.slice(begin, end);
				$scope.pageDataTotal = $scope.dataListSize;

				if($scope.pageDataTotal === 0) {
					$scope.pageDataBegin = 0;
					$scope.pageDataEnd = 0;
				} else {
					$scope.pageDataBegin = begin + 1;
					$scope.pageDataEnd = end;
				}
				if($scope.pageDataTotal !== 0 && $scope.pageDataEnd > $scope.pageDataTotal) {
					$scope.pageDataEnd = $scope.pageDataTotal
				}
				$scope.pageItemText = constantService.getPageItemText($scope.pageDataBegin, $scope.pageDataEnd,
						$scope.pageDataTotal, "History", "English");
			});
		};

		$scope.activityTypes = [
			{key: "Login", value: "login"},
			{key: "Logout", value: "logout"}
		];

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
			$scope.obj.type = "login";
			$scope.obj.fromDate = moment(new Date()).format("YYYY-MM-DD");
			$scope.obj.toDate = moment(new Date()).format("YYYY-MM-DD");
			loadCounterList();
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('activityReportController', ['growl', '$routeParams', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'loadService',
    activityReportController]);
   
	
});

