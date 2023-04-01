'use strict';

define(['app'], function (app) {

	var userlistController = function (growl, $rootScope, $scope, _, constantService, $filter, navigationService, authorizationService, localStorageService,
		configurationService, ngProgress, apiService, modalService, $modal, loadService) {

		var promis;
		var entryPage = 'user';
		var module = 'user';

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

		var loadUserList = function () {
			var obj = {
				adminId: $scope.userInfo.id,
				token: $scope.userInfo.authToken
			};
			promis = apiService.post(module+'/getUsers', obj);
			promis.then(function (data) {
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				paginate(data)
			});
		};

		var paginate = function(data, ){
			$scope.userList = data.data;
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
						$scope.pageDataTotal, "Users", "English");
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

		$scope.adjustCredit = function (id) {
			$modal.open({
				templateUrl: 'app/partials/creditAdjustment.html',
				backdrop: true,
				keyboard: true,
				modalFade: true,
				windowClass: 'modal',
				controller: function ($scope, $modalInstance, $log) {
					$scope.submit = function (obj) {
						if(!obj){
							growl.error("Please select type and enter amount", {ttl: 3000});
							return;
						}if(!obj.type){
							growl.error("Please select type", {ttl: 3000});
							return;
						}if(!obj.amount){
							growl.error("Please enter amount", {ttl: 3000});
							return;
						}
						adjustCredit($modalInstance, id, obj.type, obj.amount);
					};
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}
			});
		};

		var adjustCredit = function ($modalInstance, id, type, amount){
			loadService.showDialog();
			var obj = {
				id: id,
				amount: amount,
				type: type,
				adminId: $scope.userInfo.id,
				token: $scope.userInfo.authToken
			};
			promis = apiService.post(module+'/adjustUserCredit/', obj);
			promis.then(function (data) {
				loadService.hideDialog();
				$modalInstance.dismiss('cancel');
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 8000});
					return;
				}
				growl.success(data.message, {ttl: 3000});
				init ();
			});
		};

		$scope.showTnxHistory = function (id) {
			navigationService.showPageWithData("tnxhistory", id);
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
				loadUserList();
			});
		};

		$scope.switchToAnotherUser= function (secondaryUserId) {
			authorizationService.switchToAnotherUser($scope.userInfo.authToken, secondaryUserId, $scope.userInfo.id);
		};

	 	var init = function () {
			ngProgress.start();
			$scope.userInfo = authorizationService.getUserInfo();
			loadUserList();
			$scope.hasAuthToken = false;
			if($scope.userInfo.authToken){
				$scope.hasAuthToken = true;
			}
			ngProgress.complete();
	 	};

	 	init();

	 };

    app.register.controller('userlistController', ['growl', '$rootScope', '$scope', '_', 'constantService', '$filter', 'navigationService', 'authorizationService',
	'localStorageService', 'configurationService', 'ngProgress', 'apiService', 'modalService','$modal', 'loadService',
    userlistController]);


});

