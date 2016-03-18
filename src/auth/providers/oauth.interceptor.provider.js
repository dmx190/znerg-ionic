(function () {
    'use strict';

    angular
        .module('oauth')
        .provider('oAuthInterceptor', oAuthInterceptor);

    oAuthInterceptor.$inject = [];

    /* @ngInject */
    function oAuthInterceptor() {

        this.$get = service;
        this.config = config;

        var conf;

        service.$inject = ['$q', '$window', '$injector'];

        function config(config) {
            conf = config;
        }

        function service($q, $window, $injector) {

            return {
                request: request,
                responseError: responseError
            };

            function request(config) {

                var $state = $injector.get('$state');
                validate(conf);

                if ($window.sessionStorage.token != null) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }

                return config;
            }

            function responseError(rejection) {

                var $state = $injector.get('$state');

                if (rejection.status === 401 && rejection.data.type !== 'invalid_credentials') {
                    $state.go(conf.loginState);
                } else if (rejection.status == 400 && rejection.data.type == 'invalid_request') {
                    $state.go(conf.loginState);
                }

                return $q.reject(rejection);
            }

        }
    }



    function validate(config) {
        //check if loginState param is defined
        if (config.loginState == null) {
            throw new CrudException('You must define the loginState param');
        }
    }

})();