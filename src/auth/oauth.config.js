(function () {
    'use strict';

    angular
        .module('oauth')
        .config(config)
    ;

    config.$inject = ['$httpProvider'];

    /* @ngInject */
    function config ($httpProvider) {
        $httpProvider.interceptors.push('oAuthInterceptor');
    }

})();

