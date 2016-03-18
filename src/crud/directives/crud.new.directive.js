(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudNew', crudNew);

    crudNew.$inject = ['$state'];

    /* @ngInject */
    function crudNew($state) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, elem, attrs) {

            elem.bind('click', function () {
                $state.go($state.current.baseState + '-new');
            });
        }
    }


})();

