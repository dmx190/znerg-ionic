(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudSort', crudSort);

    crudSort.$inject = ['$state', '$stateParams'];

    /* @ngInject */
    function crudSort($state, $stateParams) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                crudSort: '@'
            }
        };
        return directive;

        function link($scope, elem, attrs) {
            elem.addClass('sorting');

            if ($stateParams.order != null) {
                if ($stateParams.order.match('^(asc|desc)$') && $stateParams.sort == attrs.crudSort) {
                    elem.removeClass('sorting');
                    elem.addClass('sorting_' + $stateParams.order);
                }
            }

            elem.bind('click', function () {
                var order = $stateParams.order == 'asc' ? 'desc' : 'asc';
                $state.go( $state.current.name, {
                    sort : $scope.crudSort,
                    order: order
                });
            });
        }
    }

})();

