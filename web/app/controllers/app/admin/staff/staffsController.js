'use strict';

define(['app'], function (app) {
	
	var staffsController = function ($http, growl, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService, modalService) {

		var promis;
		var entryPage = 'staff';
		var module = 'staff';

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

		var loadUserList = function (obj) {
			var path = "user/getUsers?tenantId=" + constantService.tracker_tenantId
			$http({
				method: "POST",
				url: constantService.tracker_baseUrl + path,
				data: obj
			}).then(function apiSuccess(response) {
				if (response.data.status === "error") {
					growl.error(response.data.message, {ttl: 3000});
				} else {
					if(response.data.status !== "success"){
						growl.error("No data found", {ttl: 3000});
					}
					paginate(response.data)
				}
			}, function apiError(response) {
				growl.error(response.message, {ttl: 3000});
			});
		};

		var paginate = function(data){
			$scope.staffList = data.data;
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
        	 $scope.staffList = filteredResult;
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
				$scope.staffList = data.slice(begin, end);
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
						$scope.pageDataTotal, "Saffs", "English");
			});
		};
		 
		$scope.add = function(){
			navigationService.menuNavigation(entryPage);
		};
		$scope.editObj = function(id){
			navigationService.showPageWithData(entryPage, id);
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
			loadUserList({});
			$scope.userInfo = authorizationService.getUserInfo();
			ngProgress.complete();
	 	};

	 	init();
	 	
	 };
	 
    app.register.controller('staffsController', ['$http', 'growl', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'modalService',
		staffsController]);
   
	
});

