'use strict';

define(['app'], function (app) {

	var dashboardController = function ($rootScope, $scope, _, constantService, navigationService, localStorageService,
										configurationService,  ngProgress, apiService, authorizationService, loadService, growl) {

		var promis;

		var getData = function () {
			$scope.userList = [];
			$scope.totalSuccess = 0;
			$scope.totalReversed = 0;
			$scope.totalSales = 0;

			var obj = {
				adminId: $scope.userInfo.id,
				token: $scope.userInfo.authToken
			};
			promis = apiService.post('report/getDashboardSummaryReport', obj);
			//loadService.showDialog();
			promis.then(function (data) {
				//loadService.hideDialog();
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				$scope.data = data.data;


				Highcharts.chart('container', {
					chart: {
						type: 'column'
					},

					credits: {
						enabled: false
					},
					title: {
						text: 'Last 7 Days Statistics'
					},
					subtitle: {
						text: 'All counters'
					},
					xAxis: {
						categories: $scope.data.lastFewDays.dates,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Sales (Thousand)'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
							'<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: 'Total Sales (Thousand)',
						color: "green",
						data: $scope.data.lastFewDays.totalSales

					}, {
						name: 'Total Refund (Thousand)',
						color: "red",
						unit: "Thousand",
						data: $scope.data.lastFewDays.totalRefund

					}, {
						name: 'Total Tickets',
						color: "#279bd2",
						unit: "",
						data: $scope.data.lastFewDays.totalTickets
					}]
				});

			});
		};

		$scope.redirect = function(page){
			navigationService.menuNavigation(page);
		};

		var init = function () {
			$scope.userInfo = authorizationService.getUserInfo();
			//getData();

		};

		init();

	};

	app.register.controller('dashboardController', ['$rootScope', '$scope', '_',
		'constantService', 'navigationService', 'localStorageService','configurationService', 'ngProgress',
		'apiService', 'authorizationService', 'loadService', 'growl',
		dashboardController]);


});

