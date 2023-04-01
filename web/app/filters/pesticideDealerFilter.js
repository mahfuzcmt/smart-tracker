'use strict';

define(['app'], function (app) {

    var pesticideDealerFilter = function () {
        return function (dataList, filterValue) {
        	
            if (!filterValue) return dataList;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
              
                if (data.name.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(data);
                } else if (data.contactNo.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(data);
                } else if (data.fatherName.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(data);
                } else if (data.businessName.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(data);
                } else if (data.businessAddress.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(data);
                } else if (data.licenseNo.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(data);
                }
            }
            return matches;
        };
    };

    app.filter('pesticideDealerFilter', pesticideDealerFilter);

});


