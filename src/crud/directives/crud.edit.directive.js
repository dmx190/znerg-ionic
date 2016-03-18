(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudEdit', crudEdit);

    crudEdit.$inject = ['$state'];

    /* @ngInject */
    function crudEdit($state) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, elem, attrs) {
            elem.bind('click', function () {
                $state.go($state.current.baseState + '-edit', {id: attrs.crudEdit});
            });
        }
    }

})();

