'use strict';

define(['app'], function (app) {
	
	var salesReportController = function (growl, $routeParams, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
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
			}
			if(param.toDate !== "" && !angular.isNull(param.toDate)){
				obj.toDate = param.toDate;
			}
			if(param.counterId !== "" && !angular.isNull(param.counterId)){
				obj.counterId = param.counterId;
			}
			if(param.routeId !== "" && !angular.isNull(param.routeId)){
				obj.routeId = param.routeId;
			}
			promis = apiService.post('report/getSalesReport', obj);
			loadService.showDialog();
			promis.then(function (data) {
				loadService.hideDialog();
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				$scope.totalSales = data.totalSales;
				$scope.totalRefund = data.totalRefund;
				$scope.netSale = data.netSale;
				paginate(data)
			});
		};

		var paginate = function(data, ){
			$scope.dataList = data.transactionList;
			$scope.dataListSize = $scope.dataList.length;
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

		$scope.statusList = [
			{key: "Success", value: "success"},
			{key: "Reversed", value: "reversed"}
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


		$scope.getRouteByCounterId = function (counterId) {
			promis = apiService.post('route/getRoutes', {colName : "counter.id", colValue: counterId});
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
				}
				$scope.routeList = data.data;
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
	 
    app.register.controller('salesReportController', ['growl', '$routeParams', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'loadService',
    salesReportController]);
   
	
});

