<!DOCTYPE html>
<html ng-app="myApp" ng-controller="applyCtrl">

    <head>
        <title>Apply For Tuition</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
    </head>
    <body>

        <div class="container">
            <h2>Apply for Tuition</h2>
            <small> Don't have teacehr code? <a target="_blank" href="http://app.tuitionmedia.com/#/new/signup">Click here for getting Your Teacher's code by completing free registratione</a></small>
            <div class="col-md-12">

                <div class="form-group col-md-3">
                    <label>Teacher Code *</label> 
                    <input data-ng-change="getTeacherInfo(obj.teacherCode)" type="text" class="form-control" id="teacherCode" placeholder="Enter Teacher Code" data-ng-model="obj.teacherCode">
                </div> 
                <div class="form-group col-md-3">
                    <label>Name</label>
                    <input disabled type="text" class="form-control" data-ng-model="teacher.fullName">
                </div> 
                <div class="form-group col-md-3">
                    <label>University</label>
                    <input disabled type="text" class="form-control" data-ng-model="teacher.university">
                </div> 
                <div class="form-group col-md-3">
                    <label>Department/Subject</label>
                    <input disabled type="text" class="form-control" data-ng-model="teacher.subject">
                </div> 
            </div>
            <div class="form-group col-md-6">
                <label>Father and Mother Mobile No *</label>
                <textarea type="text" class="form-control" id="fatherAndMotherNo" placeholder="Enter Father and Mother Mobile No" data-ng-model="obj.fatherAndMotherNo"></textarea>
            </div> 
            <div class="form-group col-md-6">
                <label>3 Friends Name and Mobile No *</label>
                <textarea type="text" class="form-control" id="friendsNameAndNo" placeholder="Enter 3 friends Name And Mobile No" data-ng-model="obj.friendsNameAndNo"></textarea>
            </div>             

            <div class="checkbox col-md-12">
                <label><input type="checkbox" name="optradio"  data-ng-model="agree"></label>
                <span style="margin-left:5px;">Agree to pay 35% after meeting with guardian but before joining & rest 35% after 7days of joining</span>
            </div>
            <div class="checkbox col-md-12">
                <label><input type="checkbox" name="optradio"  data-ng-model="mediumOID"></label>
                <span style="margin-left:5px;"> Are you able for {{tuitionInfo.mediumOID}}?</span>
            </div>
            <div class="checkbox col-md-12">
                <label><input type="checkbox" name="optradio"  data-ng-model="areaOID"></label>
                <span style="margin-left:5px;"> Are you from {{tuitionInfo.areaOID}}?</span>
            </div>
            <div class="checkbox col-md-12">
                <label><input type="checkbox" name="optradio"  data-ng-model="preferedUniversity"></label>
                <span style="margin-left:5px;"> Are you from {{tuitionInfo.preferedUniversity}}?</span>
            </div>
            
            <div class="col-md-12">
                <button type="button" class="btn btn-success" data-ng-click="sendRequ(obj, agree)">Apply</button>
            </div>
        </div>
    <script>
    var app = angular.module('myApp', []);
    app.controller('applyCtrl', function($scope, $location, $http) {    
        var tuitionCode = $location.absUrl().split('=')[1];

        $scope.getTeacherInfo = function(teacherCode){
            if(isUndefinedOrNull(teacherCode)){               
                return;
            };
            var obj = {teacherCode};
            $http({
                url: 'http://tuitionmedia.com/getTeacherInfoByCode.php',
                method: "POST",
                data: obj
            })
            .then(function(response) {
                $scope.teacher = response.data[0][0];
                getTuitionByCode();
            });
        };


        var getTuitionByCode = function(){
            
            var obj = {tuitionCode};
            $http({
                url: 'http://tuitionmedia.com/getTuitionByCode.php',
                method: "POST",
                data: obj
            })
            .then(function(response) {
                $scope.tuitionInfo = response.data[0][0];
            });
        };

         var isUndefinedOrNull = function(val) {
                return angular.isUndefined(val) || val === null  || val === "" 
        };
        
        $scope.sendRequ = function(obj, agree){

            
            if(isUndefinedOrNull(obj)){
                alert("Enter Value!");
                return;
            }
            if(isUndefinedOrNull(obj.teacherCode)){
                alert("Enter Teacher Code!");
                return;
            }
             if(isUndefinedOrNull($scope.teacher)){
                alert("Invalid Teacher Code! Please register to get teacher code!");
                window.location.replace("http://app.tuitionmedia.com/#/new/signup");
                return;
            }
            
            if(angular.equals($scope.tuitionInfo.preferedGender, "Male")){
                   if(!angular.equals($scope.teacher.gender, "Male")){
                        alert("Sorry, Male Teacher Wanted! If you think you're right, please update your gender!!");
                        window.location.replace("http://tuitionmedia.com");
                        return;
                   };                    
                };

                if(angular.equals($scope.tuitionInfo.preferedGender, "Lady")){                   
                   if(!angular.equals($scope.teacher.gender, "Lady")){
                        alert("Sorry, Lady Teacher Wanted! If you think you're right, please update your gender!!");
                        window.location.replace("http://tuitionmedia.com");
                        return;
                   };
                    
                };
           

            if(isUndefinedOrNull(obj.fatherAndMotherNo)){
                alert("Enter Mobile No Of Father and Mother!");
                return;
            }
            if(isUndefinedOrNull(obj.friendsNameAndNo)){
                alert("Enter 3 friends Name And Mobile No!");
                return;
            }
            if(!agree){
                alert("You Must Agree With Our Condition!");
                return;
            };
            if(!$scope.mediumOID){
                alert("Are you able for "+$scope.tuitionInfo.mediumOID+"? Please check.");
                return;
            };
            if(!$scope.areaOID){
                alert("Are you from "+$scope.tuitionInfo.areaOID+"? Please check.");
                return;
            };
            if(!$scope.preferedUniversity){
                alert("Are you from "+$scope.tuitionInfo.preferedUniversity+"? Please check.");
                return;
            };
            
            obj.tuitionCode = tuitionCode;
        
            $http({
                url: 'http://tuitionmedia.com/inserttuitionrequest.php',
                method: "POST",
                data: obj
            })
            .then(function(response) {
                console.log(response);
                alert("Success! You're request is accepted!");
                window.location.replace("http://tuitionmedia.com");
            }, 
            function(response) {
                console.log(response);
                alert("Sorry! Something went wrong!")
                window.location.replace("http://tuitionmedia.com");
            });
        };
    });
    </script>

    </body>
</html>
