const myApp = angular.module('myApp', []);

myApp.factory = ('helperFactory', function() {
    return {
        filterFieldArrayByDone : function(thisArray, thisField, thisValue) {
            var arrayToReturn = [];
            for (var i = 0; i < thisArray.length; i++) {
                if (thisArray[i].done == thisValue) {
                    arrayToReturn.push(thisArray[i][thisField]);
                }
            }
            return arrayToReturn;
        }
    };
});

myApp.controller('grocListController', ['$scope', function($scope) {

    var urlInsert = '/mod/insert.php';
    var urlSelect = '/mod/select.php';
    var urlUpdate = '/mod/update.php';
    var urlRemove = '/mod/remove.php';

    $scope.types = [];
    $scope.items = [];

    $scope.item = '';
    $scope.qty = '';
    $scope.types = '';
}]);

