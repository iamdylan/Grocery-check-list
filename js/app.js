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

    var urlInsert = 'mod/insert.php';
    var urlSelect = 'mod/select.php';
    var urlUpdate = 'mod/update.php';
    var urlRemove = 'mod/remove.php';

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

    function _recordAddedSuccessfully(data) {
        return ( data && !data.error && data.item );
    }

    $scope.insert = function() {
        if ($scope.goodToGo()) {
            var thisData = "item=" + $scope.item;
            thisData += "&qty=" + $scope.qty;
            thisData += "&type=" + $scope.type;
            $http({
                method : 'POST',
                url : urlInsert,
                data : thisData,
                headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
            })
            .then(function(data) {
                if (_recordAddedSuccessfully(data)) {
                    $scope.items.push({
                        id : data.item.id,
                        item : data.item.item,
                        qty : data.item.qty,
                        type : data.item.type,
                        type_name : data.item.type_name,
                        done : data.item.done
                        });
                    $scope.clear();
                }
            }
            ,function(response) {
                throw new Error('Oops... Something went wrong while inserting records');
            });
        }
    };

    $scope.select = function() {
        $http({
            method: 'GET', 
            url: urlSelect
        })
        .then(function(response) {
            if (response.data.items) {
                $scope.items = response.data.items;
            }
            if (response.data.types) {
                $scope.types = response.data.types;
                $scope.type = $scope.types[0].id;
            }
        }
        ,function(response) {
            console.log(response.data.message);
        });
    };
    $scope.select();

    $scope.update = function(item) {
        var thisData = "id=" + item.id;
        thisData += "&done=" + item.done;
        $http({
            method: 'POST',
            url: urlUpdate,
            data: thisData,
            headers: {'Content-type' : 'application/x-www-form-urlencoded'}
        })
            .then(function(data) {
                $log.info(data);
            }
            ,function(data) {
                throw new Error('Oops... Something went wrong while updating records');
            });
    };

    function _recordRemovedSuccessfully(data) {
        return ( data && !data.error );
    }

    $scope.remove = function() {
        var removeIds = helperFactory.filterFieldArrayByDone($scope.items, 'id', 1);
        if (removeIds.length > 0) 
            $http({
                method: 'POST',
                url: urlRemove,
                data: removeIds,
                headers: {'Content-type' : 'application/x-www-form-urlencoded'}
            })
                .then(function(data) {
                    if (_recordRemovedSuccessfully(data)) {
                        $scope.items = $scope.items.filter(function(item) {
                            return item.done == 0;
                        });
                    }
                }
                ,function(data) {
                    throw new Error('Oops... Something went wrong while removing records');
                });
    };
}]);

