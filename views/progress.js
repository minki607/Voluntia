//angular module description app that limits the maximum characters to be input
// user can see approximately how much more that can write through a progress bar

const app = angular.module("descApp", []);

//define maximum to be 350
app.constant('maxLengthDesc', 350);

app.controller('myController', ['$scope', 'maxLengthDesc', function($scope, maxLengthDesc){
    $scope.description = '';

    //function to be passed to restrict user from clicking the button
    $scope.validateDesc = function(){
        return ($scope.description.length > 350);
    };

    //calculate the percentage with maximum and currently typed char
    $scope.descLengthPercentage = function(){
        let percentage = Math.floor(($scope.description.length / maxLengthDesc) * 100);

        return (percentage >= 100) ? 100 : percentage;
    }

    //set the width of percentage bar
    $scope.setProgressWidth = function(){
        return {
            'width':$scope.descLengthPercentage() + "%"
        };
    }

    //warning at 50%
    $scope.progressOver50 = function(){
        return ($scope.descLengthPercentage() >= 50);
    };

    //futher warning at 75%
    $scope.progressOver75 = function(){
        return ($scope.descLengthPercentage() >= 75);
    }
}]);