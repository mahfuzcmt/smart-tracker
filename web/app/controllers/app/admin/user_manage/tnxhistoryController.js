'use strict';

define(['app'], function (app) {
	
	var tnxhistoryController = function (growl, $routeParams, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
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



		$scope.exportData = function (param) {
			var paramString = "?userId="+$routeParams.id+"&adminId="+$scope.userInfo.id+"&token="+$scope.userInfo.authToken;

			if(!param.fromDate !== "" && !angular.isNull(param.fromDate)){
				paramString += "&fromDate="+param.fromDate;
			};
			if(param.toDate !== "" && !angular.isNull(param.toDate)){
				paramString += "&toDate="+param.toDate;
			};
			if(param.type !== "" && !angular.isNull(param.type)){
				paramString += "&type="+param.type;
			};

			window.open(constantService.baseUrl+"/report/exportUserTnxReport"+paramString);
		};


		$scope.getData = function (param) {
			$scope.userList = [];
			$scope.totalAdd = 0;
			$scope.totalDeduct = 0;
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
			loadService.showDialog();
			promis = apiService.post('ticketCounter/getTransactionHistory', obj);
			promis.then(function (data) {
				loadService.hideDialog();
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				$scope.totalAdd = data.totalAdd;
				$scope.totalDeduct = data.totalDeduct;
				paginate(data)
			});
		};

		var paginate = function(data, ){
			$scope.userList = data.transactionList;
			$scope.dataListSize = $scope.userList.length;
			$scope.dataList = data.transactionList;
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
	 
    app.register.controller('tnxhistoryController', ['growl', '$routeParams', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'loadService',
    tnxhistoryController]);
   
	
});

