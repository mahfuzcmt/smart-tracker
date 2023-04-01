'use strict';

define(['app'], function (app) {

	var salesSummaryReportController = function (growl, $routeParams, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
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

		$scope.exportData = function (param, type) {

			var paramString = "?adminId="+$scope.userInfo.id+"&token="+$scope.userInfo.authToken;

			if(!param.fromDate !== "" && !angular.isNull(param.fromDate)){
				paramString += "&fromDate="+param.fromDate;
			};
			if(param.toDate !== "" && !angular.isNull(param.toDate)){
				paramString += "&toDate="+param.toDate;
			};
			if(param.status !== "" && !angular.isNull(param.status)){
				paramString += "&status="+param.status;
			};
			if(param.counterId !== "" && !angular.isNull(param.counterId)){
				paramString += "&counterId="+param.counterId;
			};
			if(param.routeId !== "" && !angular.isNull(param.routeId)){
				paramString += "&routeId="+param.routeId;
			};
			if(param.shift !== "" && !angular.isNull(param.shift)){
				paramString += "&shift="+param.shift;
			};
			if(type === "pdf"){
				window.open(constantService.baseUrl+"/report/exportSalesSummaryReportByPdf"+paramString+"&tenantId="+constantService.tenantId);
			}else if(type === "shiftWise"){
				window.open(constantService.baseUrl+"/report/exportShiftWiseSalesSummaryReportByXls"+paramString+"&tenantId="+constantService.tenantId);
			}else if(type === "20&25") {
				window.open(constantService.baseUrl+"/report/exportShiftWiseSalesSummaryReportByXls20And25"+paramString+"&tenantId="+constantService.tenantId);
			}else {
				window.open(constantService.baseUrl+"/report/exportSalesSummaryReportByXls"+paramString+"&tenantId="+constantService.tenantId);
			}
		};

		$scope.getData = function (param) {
			$scope.userList = [];
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
			if(param.status !== "" && !angular.isNull(param.status)){
				obj.status = param.status;
			};
			if(param.counterId !== "" && !angular.isNull(param.counterId)){
				obj.counterId = param.counterId;
			};
			if(param.routeId !== "" && !angular.isNull(param.routeId)){
				obj.routeId = param.routeId;
			};
			if(param.shift !== "" && !angular.isNull(param.shift)){
				obj.shift = param.shift;
			};
			promis = apiService.post('report/getSalesSummaryReport', obj);
			loadService.showDialog();
			promis.then(function (data) {
				loadService.hideDialog();
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				$scope.totalSuccess = data.totalSuccess;
				$scope.totalReversed = data.totalReversed;
				$scope.totalSales = data.totalSales;
				paginate(data)
			});
		};

		var paginate = function(data, ){
			$scope.userList = data.summary;
			$scope.dataListSize = $scope.userList.length;
			$scope.dataList = data.summary;
			createWatches($scope.dataList);
		};

		$scope.search = function(filterText){
			var filteredResult = $filter("orderFilter")($scope.dataList, filterText);
			$scope.dataListSize = filteredResult.length;
			doPagination(filteredResult);
			createWatches(filteredResult);
		};

		var doPagination = function(filteredResult){
			$scope.userList = filteredResult;
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
				$scope.userList = data.slice(begin, end);
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

		$scope.backToPrevious = function(){
			navigationService.menuNavigation("userlist");
		};

		$scope.statusList = [
			{key: "Success", value: "success"},
			{key: "Reversed", value: "reversed"}
		];

		$scope.shiftList = [
			{key: "Morning", value: "Morning"},
			{key: "Evening", value: "Evening"}
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

	app.register.controller('salesSummaryReportController', ['growl', '$routeParams', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
		'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'loadService',
		salesSummaryReportController]);


});

