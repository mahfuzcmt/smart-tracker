'use strict';

define(['app'], function (app) {

	var counterReportController = function ($routeParams, $rootScope, $scope, _, constantService, navigationService, localStorageService, configurationService,  ngProgress, apiService, authorizationService, loadService, growl) {

		var promis;

		var getData = function () {
			$scope.userList = [];
			$scope.totalSuccess = 0;
			$scope.totalReversed = 0;
			$scope.totalSales = 0;

			var obj = {
				adminId: $scope.userInfo.id,
				token: $scope.userInfo.authToken,
				counterId: $routeParams.id
			};
			promis = apiService.post('report/getDashboardSummaryReport', obj);
			loadService.showDialog();
			promis.then(function (data) {
				loadService.hideDialog();
				if(data.status !== "success"){
					growl.error(data.message, {ttl: 3000});
				}
				$scope.data = data.data;

				$scope.counterName = $scope.data .counter;
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
						text: "Statistics of "+$scope.counterName
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
						data: $scope.data.lastFewDays.success

					}, {
						name: 'Total Refund (Thousand)',
						color: "red",
						unit: "Thousand",
						data: $scope.data.lastFewDays.refund

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
			getData();
		};

		init();

	};

	app.register.controller('counterReportController', ['$routeParams', '$rootScope', '$scope', '_',
		'constantService', 'navigationService', 'localStorageService','configurationService', 'ngProgress',
		'apiService', 'authorizationService', 'loadService', 'growl',
		counterReportController]);


});

