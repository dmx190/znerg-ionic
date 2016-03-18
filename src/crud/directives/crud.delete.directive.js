(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudDelete', crudDelete);

    crudDelete.$inject = ['$state', 'crudResource', 'toaster'];

    /* @ngInject */
    function crudDelete($state,  crudResource, toaster) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, elem, attrs) {

            elem.bind('click', click);

            function click() {

                var resource = new crudResource($state.current.apiUrl);
                if (!elem.data('loading')) {

                    if (typeof attrs.confirm != 'undefined') {
                        var conf = attrs.confirm == "" ? confirm("Want to delete?") : confirm(attrs.confirm);
                        if (!conf) return;
                    }

                    elem.attr('disabled', true);
                    elem.data('loading', true);

                    resource.delete({id: attrs.crudDelete}, success, error);
                }

                function success() {
                    toaster.success({ body:"Item deleted successfully"});
                    $state.go($state.current, {}, {reload: true});
                }

                function error(res) {
                    var message = "There has been error processing your request";

                    if (res.data.message != null) {
                        message = res.data.message;
                    }

                    toaster.error({ body: message});
                    enable();
                }

                function enable() {
                    elem.removeAttr('disabled');
                    elem.data('loading', false);
                }
            }
        }
    }

})();

