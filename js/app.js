const myApp = angular.module('myApp', ['ngAnimate']);

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

    function _recordAddedSuccessfully(response) {
        return ( response.data && !response.data.error && response.data.item );
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
            .then(function(response) {
                if (_recordAddedSuccessfully(response)) {
                    $scope.items.push({
                        id : response.data.item.id,
                        item : response.data.item.item,
                        qty : response.data.item.qty,
                        type : response.data.item.type,
                        type_name : response.data.item.type_name,
                        done : response.data.item.done
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
                response.data.types.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                $scope.types = response.data.types;
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
            .then(function(response) {
                $log.info(response.data);
            }
            ,function(response) {
                console.log(response.data.message);
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
                data: "ids=" + removeIds.join('|'),
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

    $scope.print = function() {
        window.print();
    };

}]);

