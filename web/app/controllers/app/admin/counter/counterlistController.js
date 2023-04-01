'use strict';

define(['app'], function (app) {
	
	var counterlistController = function ($location, growl, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService, modalService) {

		var promis;
		var entryPage = 'counter';
		var module = 'ticketCounter';

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

		var loadCounterList = function () {
			promis = apiService.post(module+'/getCounters');
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error("No data found", {ttl: 3000});
				}
				paginate(data)
			});
		};

		var paginate = function(data, ){
			$scope.counterList = data.data;
			$scope.dataListSize = data.totalCount;
			$scope.dataList = data.data;
			createWatches($scope.dataList);
		}

		$scope.search = function(filterText){
			var filteredResult = $filter("orderFilter")($scope.dataList, filterText);
            		$scope.dataListSize = filteredResult.length;
            		doPagination(filteredResult);
            		createWatches(filteredResult);
	     };
			 		                 
	     var doPagination = function(filteredResult){ 
        	 $scope.counterList = filteredResult;
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
				$scope.counterList = data.slice(begin, end);
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
						$scope.pageDataTotal, "Counters", "English");
			});
		};
		 
		$scope.add = function(){
			navigationService.menuNavigation(entryPage);
		};
		$scope.editObj = function(id){
			navigationService.showPageWithData(entryPage, id);
		};
		$scope.showReport = function(id){
			navigationService.showPageWithData("counterReport", id);
		};
		$scope.deleteObj = function (id) {
			var modalOptions = {
				closeButtonText: 'No',
				actionButtonText: 'Yes',
				headerText: ' Confirmation',
				bodyText: ' Are you sure to delete?'
			};
			var modalDefaults = {
				templateUrl: 'app/partials/confirmation.html'
			};
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				if(result === 'cancel'){
					return;
				}
				promis = apiService.delete(module+'/delete/'+id);
				promis.then(function (data) {
					if(data.status !== "success"){
						growl.error(data.message, {ttl: 3000});
						return;
					}
					growl.success(data.message, {ttl: 3000});
					init ();
				});
			});
		};

	 	var init = function () {
			ngProgress.start();
			loadCounterList();
			$scope.userInfo = authorizationService.getUserInfo();
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('counterlistController', ['$location', 'growl', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'modalService',
    counterlistController]);
   
	
});

