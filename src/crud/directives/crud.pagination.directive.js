(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudPagination', pagination);


    /* @ngInject */
    function pagination() {
        var directive = {
            controller: Controller,
            restrict: 'E',
            template: '<nav ng-if="pages.length">'+
            '<ul class="pagination">'+
            '<li ng-repeat="page in pages" ui-sref-active="active" ng-class="{disabled: page.disabled}">'+
            '<a ng-if="page.disabled" ng-bind-html="page.label"></a>'+
            '<a ng-if="!page.disabled" ui-sref="{{ page.state }}" ng-bind-html="page.label"></a>'+
            '</li></ul></nav>',
            scope: {
                total: '@'
            }
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$stateParams', '$sce', '$state'];

    /* @ngInject */
    function Controller($scope, $stateParams, $sce, $state) {


        var pages = function () {

            if (typeof $stateParams.size != 'undefined' && $stateParams.size.match(/^(100|[1-9][0-9]?)$/)) {
                var size = parseInt($stateParams.size);
            }

            var itemsPerPage = 5;
            //calculate total pages
            var totalPages = Math.ceil($scope.total / (typeof size != 'undefined' ? size : itemsPerPage));
            totalPages =  Math.max(totalPages || 0, 1);

            var res = [];

            if (totalPages <= 1) {
                return res;
            }

            var currentPage = 1;

            if (typeof $stateParams.page != 'undefined' && $stateParams.page.match(/^[0-9]+$/)) {
                currentPage = parseInt($stateParams.page);
            }


            var previous = {
                label: $sce.trustAsHtml('&laquo;'),
                state: $state.current.name + '({page: '+ (currentPage - 1) + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            };

            var next = {
                label: $sce.trustAsHtml('&raquo;'),
                state: $state.current.name + '({page: '+ (currentPage + 1) + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            };

            if (currentPage == 1) {
                previous.disabled = true;
                previous.state = $state.current.name + '({page: '+ $stateParams.page  + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            }

            if (currentPage == totalPages) {
                next.disabled = true;
                next.state = $state.current.name + '({page: '+ $stateParams.page + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            }

            //add previous page
            res.push(previous);

            for (var i=1; i<=totalPages; i++) {
                res.push({
                    label: $sce.trustAsHtml(i.toString()),
                    state: $state.current.name + '({page: '+ i + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
                });
            }

            //add nex page
            res.push(next);

            return res;

        };
        $scope.$watch('total', function () {
            $scope.pages = pages();
        });
        $scope.pages = pages();
    }

})();

