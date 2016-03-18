(function () {
    'use strict';

    angular
        .module('oauth')
        .factory('oAuthLogin', oAuthLogin);

    oAuthLogin.$inject = ['$http', 'oAuth', '$q', '$window'];

    /* @ngInject */
    function oAuthLogin($http, oAuth, $q, $window) {
        return service;

        ////////////////

        function service(credentials) {

            validate(oAuth.conf);

            var deferred = $q.defer();
            $http({
                method   : 'POST',
                url      : oAuth.conf.baseApiUrl + oAuth.conf.loginPath,
                data   : {
                    username  : credentials.username,
                    password  : credentials.password,
                    client_id : oAuth.conf.clientId
                }
            }).then(function (res) {
                $window.sessionStorage.token = res.data.accessToken;
                $window.sessionStorage.scope = res.data.scope;
                deferred.resolve(res);
            }, function (res) {
                deferred.reject(res);
            });

            return deferred.promise;
        }
    }

    function validate(config) {
        //check if loginState param is defined
        if (config.loginState == null) {
            throw new CrudException('You must define the loginState param');
        }
    }

})();

