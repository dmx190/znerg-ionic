//(function () {
//    'use strict';
//
//    angular
//        .module('oauth')
//        .provider('apiOAuth', apiOAuthProvider);
//
//    apiOAuthProvider.$inject = [];
//
//    /* @ngInject */
//    function apiOAuthProvider() {
//
//        this.$get = apiAuth;
//        this.config = config;
//
//        var conf = {
//            baseApiUrl: '',
//            loginPath: 'oauth/login',
//            clientId: ''
//        };
//
//        apiAuth.$inject = ['$http', '$q', '$window'];
//
//
//        function config(config) {
//            conf = angular.extend({}, conf, config);
//        }
//
//        function apiAuth($http, $q, $window)
//        {
//            return {
//                login: function (credentials) {
//
//                    validate(conf);
//
//                    var deferred = $q.defer();
//                    $http({
//                        method   : 'POST',
//                        url      : conf.baseApiUrl + conf.loginPath,
//                        data   : {
//                            username  : credentials.username,
//                            password  : credentials.password,
//                            client_id : conf.clientId
//                        }
//                    }).then(function (res) {
//                        $window.sessionStorage.token = res.data.accessToken;
//                        $window.sessionStorage.scope = res.data.scope;
//                        deferred.resolve(res);
//                    }, function (res) {
//                        deferred.reject(res);
//                    });
//
//                    return deferred.promise;
//                },
//                logout: function () {
//                    validate(conf);
//                    delete $window.sessionStorage.token;
//                }
//            };
//        }
//
//    }
//
//    function validate(config) {
//        //check if baseApiUrl is defined
//        if (config.baseApiUrl == null) {
//            throw new CrudException('You must define the baseApiUrl param');
//        }
//
//        //check auth array
//        if (config.clientId == null) {
//            throw new CrudException('You must define the clientId param');
//        }
//    }
//
//})();