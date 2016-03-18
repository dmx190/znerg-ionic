angular
    .module('oauth')
    .run(runPreviousPage);

    runPreviousPage.$inject = ['$rootScope'];

    /* @ngInject */
    function runPreviousPage ($rootScope) {
        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        function stateChangeSuccess(ev, to, toParams, from) {
            $rootScope.previousState = from;
        }
    }