(function () {
    'use strict';

    angular
        .module('oauth')
        .factory('oAuthPassword', oAuthPassword);

    oAuthPassword.$inject = ['$http', 'oAuth', '$q'];

    /* @ngInject */
    function oAuthPassword($http, oAuth, $q) {
        var service = {
            email: email,
            reset: reset
        };
        return service;

        ////////////////

        function email($email) {
            return $q(function (resolve, reject) {
                var passwordEmailUrl = oAuth.conf.baseApiUrl + oAuth.conf.passwordEmailPath;
                $http.post(passwordEmailUrl, {email: $email}).then(success, error);

                function success (res) {
                    resolve(res);
                }

                function error (res) {
                    reject(res);
                }
            });
        }

        function reset($credentials) {
            return $q(function (resolve, reject) {
                var passwordEmailUrl = oAuth.conf.baseApiUrl + oAuth.conf.passwordResetPath;
                $http.post(passwordEmailUrl, $credentials).then(success, error);

                function success (res) {
                    resolve(res);
                }

                function error (res) {
                    reject(res);
                }
            });
        }
    }

})();

