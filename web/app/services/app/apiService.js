
'use strict';

define(['app'], function (app) {

    var apiService = function ($http, $q, constantService) {

        var serviceBase = constantService.baseUrl;
        var tenantId = constantService.tenantId;
        var imageUploader = 'imageUploader/upload';


        this.baseUrl = function () {
            return this.serviceBase
        };

		this.post = function (q, obj) {
			obj = obj || {};
			obj.tenantId = tenantId;
			return $http.post(serviceBase + q, obj).then(function (results) {
				return results.data;
            });
        };

		this.get = function (q) {
			q = q+"?tenantId=" +tenantId;
			return $http.get(serviceBase + q).then(function (results) {
				return results.data;
			});
		};

		this.delete = function (q) {
			q = q+"?tenantId=" +tenantId;
			return $http.delete(serviceBase + q).then(function (results) {
				return results.data;
			});
		};

		this.fileUploader = function (subPath) {
			if(angular.isUndefined(subPath)){
				subPath = imageUploader
			}
			return serviceBase+"/"+subPath;
		};

	};

    app.service('apiService', ['$http', '$q', 'constantService', apiService]);

});