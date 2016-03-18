(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudSearch', crudSearch);

    crudSearch.$inject = [];

    /* @ngInject */
    function crudSearch() {
        var directive = {
            controller: Controller,
            template: '<form ng-submit="searchSubmit(keyword)" class="input-group">'+
            '<input type="text" placeholder="Search..." class="input-sm form-control" ng-model="keyword">'+
            '<span class="input-group-btn">'+
            '<button type="submit" class="btn btn-sm btn-primary"> Go!</button>'+
            '</span>'+
            '</form>',
            restrict: 'E',
            scope: {
                fields: "@"
            }
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$stateParams', '$location'];

    /* @ngInject */
    function Controller($scope, $stateParams, $location) {
        if (typeof $stateParams.keyword != 'undefined') {
            $scope.keyword = $stateParams.keyword;
        }

        $scope.searchSubmit = function (keyword) {
            $location.path($location.path()).search({keyword: keyword, fields: $scope.fields});
        }
    }

})();

