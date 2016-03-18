(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudGoList', crudGoList);

    crudGoList.$inject = ['$state'];

    /* @ngInject */
    function crudGoList($state) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link($scope, elem) {
            elem.bind('click', function () {
                $state.go($state.current.baseState);
            });
        }
    }

})();

