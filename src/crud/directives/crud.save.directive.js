(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudSave', crudSave);

    crudSave.$inject = ['$state', '$stateParams', 'toaster'];

    /* @ngInject */
    function crudSave($state, $stateParams, toaster) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                item: '=crudSave'
            }
        };
        return directive;

        function link(scope, element, attrs) {

            element.bind('submit', submit);

            function submit(e) {

                e.preventDefault();

                if ($stateParams.id != null) {
                    if (attrs.method != null && 'PUT' === angular.uppercase(attrs.method)) {
                        scope.item.$replace({id: $stateParams.id}, success, error);
                    } else {
                        scope.item.$update({id: $stateParams.id}, success, error);
                    }

                } else {
                    scope.item.$save(success, error);
                }

                function success() {
                    toaster.success({ body:"Item saved successfully"});
                    $state.go($state.current.baseState);
                }

                function error(res) {
                    var description = "";
                    var message = "A problem occurred while saving your changes";

                    if (res.data.message != null) {
                        message = res.data.message;
                    }

                    if (res.data.description != null) {
                        description = res.data.description;
                    }

                    toaster.error({ body: description, title: message});
                }
            }
        }

    }

})();

