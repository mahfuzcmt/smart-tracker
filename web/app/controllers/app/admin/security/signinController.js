
'use strict';

define(['app'], function (app) {
	
	var signinController = function ( $scope, $routeParams, signInService, navigationService, localStorageService, 
		configurationService, constantService, $upload, authorizationService, saveDataService, apiService, growl) {
		
		var promis;
		$scope.login = { loginID : '', password : '', msg : 'Df1000' };

		$scope.loginID ;
		$scope.success = false;
		$scope.part1 = true;
		$scope.obj = {};


		$scope.signIn = function (login) {
        	if(!validateLoginForm()){
        		return;
        	}
        	var requestParam = {username: login.loginID, password: login.password};
        	promis = apiService.post('login', requestParam);
			promis.then(function (data) {
				if(data.status == "warning"){
					$scope.response = data.message;
				return;
				}
				if(data.data.availableRoutes){
					growl.warning("Please login with andrond app!", {ttl: 5000});
					return
				}
				$scope.userData = data.data;
				var menuJson = $.parseJSON($scope.userData.menuJSON);
				var webMenu;
				if(menuJson.children != undefined){
        			for(var i=0; i< menuJson.children.length; i++){
        				if(menuJson.children[i].id == "webMenu"){
        					webMenu = menuJson.children[i].children;
        				}
        			}
				}

				var userInfo = data.data;
				if(webMenu.length> 0){
					for(var i=0; i< webMenu.length; i++){
						if( webMenu[i].enable == true){
							userInfo.selectedLeftMenu = webMenu[i].url;
							localStorageService.setValue(constantService.userInfoCookieStoreKey, userInfo);
							navigationService.menuNavigation(userInfo.selectedLeftMenu);
							return;
						}
					}
				}
				saveOperationLog();
			});
		};
		
		
		var saveOperationLog = function () {
			var obj = {};
			obj.operation = 'login';
			obj.loginID = $scope.loginID;
			promis = saveDataService.saveData('operationlog', obj);
			promis.then(function (data) {
				
			});
        };

		$scope.$watch("login.loginID", function (filterText) {
			validateLoginForm();
        });
		
		$scope.$watch("login.password", function (filterText) {
			validateLoginForm();
        });
			
	 	var validateLoginForm = function () {
	 		var isValid = false;
	 		if($scope.login == undefined || $scope.login == null || 
	 				$scope.login.loginID == undefined || $scope.login.loginID == null || $scope.login.loginID.trim().length == 0){
	 			$scope.login.msg = 'Nl1001';
	 		} else if ($scope.login.password == undefined || $scope.login.password == null || $scope.login.password.trim().length == 0){
	 			$scope.login.msg = 'Nl1002';
	 		} else {
	 			$scope.login.msg = 'Df1000';
	 			isValid = true;
	 		}
	 		return isValid;
	 	};
		
		 $scope.roleList = [{"id"	: "tutor", "text" : "Tutor"},{"id"	: "guardian", "text" : "Guardian"}];

	 	var init = function () {
	 		$(".right-side").addClass("strech");
			$('.left-side').addClass("collapse-left");
			if($routeParams.signup == 'signup'){
				$scope.signUpPart = true;
			}
	 	};

	 	init();
		 
 	};

 	
    app.register.controller('signinController', ['$scope', '$routeParams', 'signInService', 'navigationService', 
	'localStorageService', 'configurationService','constantService', '$upload', 'authorizationService', 
	'saveDataService', 'apiService','growl',
    signinController]);
   
	
});














