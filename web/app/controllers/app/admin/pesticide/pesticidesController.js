'use strict';

define(['app'], function (app) {

	var pesticidesController = function (growl, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService, modalService, $modal, loadService) {

		var promis;
		var entryPage = 'pesticide';
		var module = 'pesticideDealer';

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

		$scope.licenseTypeList = [
			{key: "Retail", value: "Retail"},
			{key: "Wholesale", value: "Wholesale"}
		];

		$scope.statusList = [
			{key: "Active", value: "Active"},
			{key: "Inactive", value: "Inactive"},
			{key: "Expired", value: "Expired"}
		];

		var loadUnions = function (obj) {
			promis = apiService.post('Geo/getUnionsByUpazila', obj);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				$scope.unions = data.data
			});
		};

		$scope.loadBlocksByUnion = function (obj) {
			promis = apiService.post('Geo/getBlocksByUnion', obj);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				$scope.blockList = data.data
			});
		};

		$scope.loadDataList = function (obj) {
			promis = apiService.post(module+'/list', obj);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				paginate(data)
			});
		};

		var paginate = function(data, ){
			$scope.userList = data.data;
			$scope.dataListSize = $scope.userList.length;
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
								$scope.pageDataTotal, "Dealers", 'English');
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
						$scope.pageDataTotal, "Dealers", "English");
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
				var obj = {
					id: id,
					adminId: $scope.userInfo.id,
					token: $scope.userInfo.authToken
				};
				promis = apiService.post(module+'/delete', obj);
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

		$scope.changeStatus= function (status,userID) {
			$scope.response = {};
			promis = apiService.post('changestatusofuser/'+userID+'/'+status);
			promis.then(function (data) {
				$scope.response.status = data.status;
				$scope.response.message = data.message;
				growl.success(data.message, { ttl: 3000 });
				if(data.status != "success"){
					return;
				}
				$scope.loadDataList();
			});
		};

		$scope.switchToAnotherUser= function (secondaryUserId) {
			authorizationService.switchToAnotherUser($scope.userInfo.authToken, secondaryUserId, $scope.userInfo.id);
		};

	 	var init = function () {
			ngProgress.start();
			$scope.userInfo = authorizationService.getUserInfo();
			loadUnions()
			$scope.hasAuthToken = false;
			if($scope.userInfo.authToken){
				$scope.hasAuthToken = true;
			}
			ngProgress.complete();
	 	};

	 	init();

	 };

    app.register.controller('pesticidesController', ['growl', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'modalService','$modal', 'loadService',
    pesticidesController]);


});

