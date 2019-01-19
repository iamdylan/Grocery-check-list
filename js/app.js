const myApp = angular.module('myApp', []);

myApp.constant('MAX_LENGTH', 50);
myApp.constant('MIN_LENGTH', 2);

myApp.factory('helperFactory', function() {
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
})

myApp.controller('grocListController', ['$scope', '$http', '$log', 'helperFactory', 'MAX_LENGTH', 'MIN_LENGTH', 
    function($scope, $http, $log, helperFactory, MAX_LENGTH, MIN_LENGTH) {

    var urlInsert = '/mod/insert.php';
    var urlSelect = '/mod/select.php';
    var urlUpdate = '/mod/update.php';
    var urlRemove = '/mod/remove.php';

    $scope.types = [];
    $scope.items = [];

    $scope.item = '';
    $scope.qty = '';
    $scope.types = '';

    $scope.charactersNeeded = function() {
        var characters = (MIN_LENGTH - $scope.item.length);
        return (characters > 0) ? characters : 0;
    };

    $scope.charactersRemaining = function() {
        var characters = (MAX_LENGTH - $scope.item.length);
        return (characters > 0) ? characters : 0;
    };


    $scope.charactersOver = function() {
        var characters = (MAX_LENGTH - $scope.item.length);
        return (characters < 0) ? Math.abs(characters) : 0;
    };

    $scope.minCharactersMet = function() {
        return ($scope.charactersNeeded() == 0);
    };

    $scope.anyCharactersOver = function() {
        return ($scope.charactersOver() > 0);
    };

    $scope.isCharWithinRange = function() {
        return (
            $scope.minCharactersMet() && !$scope.anyCharactersOver()
        );
    };

    $scope.goodToGo = function() {
        return (
            $scope.isCharWithinRange() && $scope.qty > 0 && $scope.type > 0
        );
    };

    $scope.clear = function() {
        $scope.item = '';
        $scope.qty = '';
    };
}]);

