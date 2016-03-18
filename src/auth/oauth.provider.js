(function () {
    'use strict';

    angular
        .module('oauth')
        .provider('oAuth', oAuthProvider);

    oAuthProvider.$inject = [];

    /* @ngInject */
    function oAuthProvider() {

        var self = this;

        self.$get = apiAuth;
        self.config = config;

        self.conf = {
            baseApiUrl: '',
            loginPath: 'oauth/login',
            clientId: ''
        };

        apiAuth.$inject = [];

        function config(config) {
            validate(config);
            self.conf = angular.extend({}, self.conf, config);
        }

        function apiAuth() {
            return self;
        }
    }

    function validate(config) {
        //check if baseApiUrl is defined
        if (config.baseApiUrl == null) {
            throw new CrudException('You must define the baseApiUrl param');
        }

        //check auth array
        if (config.clientId == null) {
            throw new CrudException('You must define the clientId param');
        }
    }

})();