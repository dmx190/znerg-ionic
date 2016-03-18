(function () {
    'use strict';

    angular
        .module('oauth', []);

})();
(function () {
    'use strict';

    angular
        .module('crud', [
            'ui.router'
        ])

})();
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
(function () {
    'use strict';

    angular
        .module('crud')
        .provider('crudConfig', crudConfigProvider);

    crudConfigProvider.$inject = [];

    /* @ngInject */
    function crudConfigProvider() {

        var self = this;

        self.$get = crudConfig;
        self.config = config;

        self.conf = {
            baseApiUrl: ''
        };

        crudConfig.$inject = [];

        function config(config) {
            validate(config);
            self.conf = angular.extend({}, self.conf, config);

        }

        function crudConfig() {
            return self.conf;
        }
    }

    function validate(config) {
        //check if baseApiUrl is defined
        if (config.baseApiUrl == null) {
            throw new CrudException('You must define the baseApiUrl param');
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('oauth')
        .directive('oauthLogin', login);

    login.$inject = ['oAuthLogin', '$rootScope', '$state', '$location', 'toaster'];

    /* @ngInject */
    function login(oAuthLogin, $rootScope, $state, $location, toaster) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                credentials: '=oauthLogin'
            }
        };
        return directive;

        function link($scope, element, attrs) {
            element.bind('submit', submit);

            function submit(e) {

                e.preventDefault();

                //select button submit
                var submit = element.find('[type=submit]');


                if (!submit.data('loading')) {
                    oAuthLogin($scope.credentials).then(success, error);

                    //disable submit button
                    submit.attr('disabled', true);
                    submit.data('loading', true);
                }

                function success() {
                    if (attrs.redirectTo) {
                        $state.go(attrs.redirectTo);
                    } else if ($rootScope.previousState.name) {
                        $state.go($rootScope.previousState.name);
                    } else {
                        $location.path('/');
                    }
                }

                function error(res) {

                    var description = "";
                    var message = "The user credentials were incorrect";

                    if (res.data.message != null) {
                        message = res.data.message;
                    }

                    if (res.data.description != null) {
                        description = res.data.description;
                    }

                    toaster.error({ body: description, title: message});

                    //enable submit button
                    submit.attr('disabled', false);
                    submit.data('loading', false);
                }
            }
        }
    }

})();


(function () {
    'use strict';

    angular
        .module('oauth')
        .directive('oauthLogout', logout);

    logout.$inject = ['oAuth', 'oAuthLogout', '$state'];

    /* @ngInject */
    function logout(oAuth, oAuthLogout, $state) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link($scope, element, attrs) {
            element.bind('click', click);

            function click(e) {

                e.preventDefault();

                oAuthLogout();
                $state.go(oAuth.conf.loginState);
            }
        }
    }

})();


(function () {
    'use strict';

    angular
        .module('oauth')
        .directive('passwordEmail', passwordEmail);

    passwordEmail.$inject = ['oAuthPassword', 'oAuth', 'toaster', '$state'];

    /* @ngInject */
    function passwordEmail(oAuthPassword, oAuth, toaster, $state) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                email: '=passwordEmail'
            }
        };
        return directive;

        function link(scope, element, attrs) {

            element.bind('submit', submit);

            function submit(e) {

                e.preventDefault();

                //select button submit
                var submit = element.find('[type=submit]');

                if (!submit.data('loading')) {
                    oAuthPassword.email(scope.email).then(success, error);

                    //disable submit button
                    submit.attr('disabled', true);
                    submit.data('loading', true);
                }

                function success() {
                    //show success message
                    toaster.success({
                        body: 'We have e-mailed your password reset link!'
                    });

                    //redirect to login state
                    $state.go(oAuth.conf.loginState);
                }

                function error(res) {
                    //show error message
                    toaster.error({
                        title: res.data.message,
                        body: res.data.description
                    });

                    //enable submit button
                    submit.attr('disabled', false);
                    submit.data('loading', false);
                }
            }
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('oauth')
        .directive('passwordReset', passwordReset);

    passwordReset.$inject = ['oAuthPassword', 'oAuth', 'toaster', '$state', '$stateParams'];

    /* @ngInject */
    function passwordReset(oAuthPassword, oAuth, toaster, $state, $stateParams) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                credentials: '=passwordReset'
            }
        };
        return directive;

        function link(scope, element, attrs) {

            element.bind('submit', submit);

            function submit(e) {

                e.preventDefault();

                //select button submit
                var submit = element.find('[type=submit]');

                if (!submit.data('loading')) {
                    scope.credentials.token = $stateParams.token;

                    oAuthPassword.reset(scope.credentials).then(success, error);

                    //disable submit button
                    submit.attr('disabled', true);
                    submit.data('loading', true);
                }

                function success() {
                    //show success message
                    toaster.success({
                        body: 'Your password has been reset!'
                    });

                    //redirect to login state
                    $state.go(oAuth.conf.loginState);
                }

                function error(res) {
                    //show error message
                    toaster.error({
                        title: res.data.message,
                        body: res.data.description
                    });

                    //enable submit button
                    submit.attr('disabled', false);
                    submit.data('loading', false);
                }
            }
        }
    }

})();


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


(function () {
    'use strict';

    angular
        .module('oauth')
        .factory('oAuthLogout', oAuthLogout);

    oAuthLogout.$inject = ['$window'];

    /* @ngInject */
    function oAuthLogout($window) {
        return service;

        ////////////////

        function service() {
            delete $window.sessionStorage.token;
        }
    }

})();


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


(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudGoList', crudGoList);

    crudGoList.$inject = ['$state'];

    /* @ngInject */
    function crudGoList($state) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link($scope, elem) {
            elem.bind('click', function () {
                $state.go($state.current.baseState);
            });
        }
    }

})();


(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudNew', crudNew);

    crudNew.$inject = ['$state'];

    /* @ngInject */
    function crudNew($state) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, elem, attrs) {

            elem.bind('click', function () {
                $state.go($state.current.baseState + '-new');
            });
        }
    }


})();


(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudPagination', pagination);


    /* @ngInject */
    function pagination() {
        var directive = {
            controller: Controller,
            restrict: 'E',
            template: '<nav ng-if="pages.length">'+
            '<ul class="pagination">'+
            '<li ng-repeat="page in pages" ui-sref-active="active" ng-class="{disabled: page.disabled}">'+
            '<a ng-if="page.disabled" ng-bind-html="page.label"></a>'+
            '<a ng-if="!page.disabled" ui-sref="{{ page.state }}" ng-bind-html="page.label"></a>'+
            '</li></ul></nav>',
            scope: {
                total: '@'
            }
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$stateParams', '$sce', '$state'];

    /* @ngInject */
    function Controller($scope, $stateParams, $sce, $state) {


        var pages = function () {

            if (typeof $stateParams.size != 'undefined' && $stateParams.size.match(/^(100|[1-9][0-9]?)$/)) {
                var size = parseInt($stateParams.size);
            }

            var itemsPerPage = 5;
            //calculate total pages
            var totalPages = Math.ceil($scope.total / (typeof size != 'undefined' ? size : itemsPerPage));
            totalPages =  Math.max(totalPages || 0, 1);

            var res = [];

            if (totalPages <= 1) {
                return res;
            }

            var currentPage = 1;

            if (typeof $stateParams.page != 'undefined' && $stateParams.page.match(/^[0-9]+$/)) {
                currentPage = parseInt($stateParams.page);
            }


            var previous = {
                label: $sce.trustAsHtml('&laquo;'),
                state: $state.current.name + '({page: '+ (currentPage - 1) + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            };

            var next = {
                label: $sce.trustAsHtml('&raquo;'),
                state: $state.current.name + '({page: '+ (currentPage + 1) + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            };

            if (currentPage == 1) {
                previous.disabled = true;
                previous.state = $state.current.name + '({page: '+ $stateParams.page  + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            }

            if (currentPage == totalPages) {
                next.disabled = true;
                next.state = $state.current.name + '({page: '+ $stateParams.page + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
            }

            //add previous page
            res.push(previous);

            for (var i=1; i<=totalPages; i++) {
                res.push({
                    label: $sce.trustAsHtml(i.toString()),
                    state: $state.current.name + '({page: '+ i + (typeof size != 'undefined' ? ',size:' + size : '') +'})'
                });
            }

            //add nex page
            res.push(next);

            return res;

        };
        $scope.$watch('total', function () {
            $scope.pages = pages();
        });
        $scope.pages = pages();
    }

})();


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


(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudSearch', crudSearch);

    crudSearch.$inject = [];

    /* @ngInject */
    function crudSearch() {
        var directive = {
            controller: Controller,
            template: '<form ng-submit="searchSubmit(keyword)" class="input-group">'+
            '<input type="text" placeholder="Search..." class="input-sm form-control" ng-model="keyword">'+
            '<span class="input-group-btn">'+
            '<button type="submit" class="btn btn-sm btn-primary"> Go!</button>'+
            '</span>'+
            '</form>',
            restrict: 'E',
            scope: {
                fields: "@"
            }
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$stateParams', '$location'];

    /* @ngInject */
    function Controller($scope, $stateParams, $location) {
        if (typeof $stateParams.keyword != 'undefined') {
            $scope.keyword = $stateParams.keyword;
        }

        $scope.searchSubmit = function (keyword) {
            $location.path($location.path()).search({keyword: keyword, fields: $scope.fields});
        }
    }

})();


(function () {
    'use strict';

    angular
        .module('crud')
        .directive('crudSort', crudSort);

    crudSort.$inject = ['$state', '$stateParams'];

    /* @ngInject */
    function crudSort($state, $stateParams) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                crudSort: '@'
            }
        };
        return directive;

        function link($scope, elem, attrs) {
            elem.addClass('sorting');

            if ($stateParams.order != null) {
                if ($stateParams.order.match('^(asc|desc)$') && $stateParams.sort == attrs.crudSort) {
                    elem.removeClass('sorting');
                    elem.addClass('sorting_' + $stateParams.order);
                }
            }

            elem.bind('click', function () {
                var order = $stateParams.order == 'asc' ? 'desc' : 'asc';
                $state.go( $state.current.name, {
                    sort : $scope.crudSort,
                    order: order
                });
            });
        }
    }

})();


function CrudException(message) {
    this.name = 'Crud Exception';
    this.message = message;
}

CrudException.prototype = new Error();
CrudException.prototype.constructor = CrudException;
(function () {
    'use strict';

    angular
        .module('crud')
        .provider('crudState', crudStateProvider);

    crudStateProvider.$inject = ['$stateProvider'];

    /* @ngInject */
    function crudStateProvider($stateProvider) {


        this.$get = angular.noop;
        this.statesFor = statesFor;
        this.baseApiUrl = baseApiUrl;

        var crudBaseApiUrl;

        function baseApiUrl(url) {
            crudBaseApiUrl = url;
        }

        function statesFor(config) {

            validate(config);

            var lastDot = config.baseState.lastIndexOf('.');
            var base    = config.baseState.substr((lastDot != -1 ? lastDot - 1 : -2) + 2);


            var defaultConf= {
                url       : '/'+base,
                auth      : [],
                tplPrefix : base.toLowerCase(),
                ctrlPrefix: titleCase(base),
                directory : 'app/pages/' + config.baseState.replace('\.', '\/') + '/',
                apiUrl    : base
            };

            function itemsResolve(apiUrl, query) {

                items.$inject = ['crudResource', 'crudParameters', '$stateParams'];

                return {
                    items: items
                };

                function items(crudResource, crudParameters, params) {
                    query = query || {};
                    query = angular.extend({}, query, crudParameters.all(params));
                    return crudResource(apiUrl).query(query).$promise;
                }
            }

            function itemResolve(apiUrl, query) {

                item.$inject = ['crudResource', '$stateParams'];

                return {
                    item: item
                };

                function item(crudResource, $stateParams) {
                    if ($stateParams.id != null) {
                        query = query || {};
                        query = angular.extend({}, query, {id: $stateParams.id});
                        return crudResource(apiUrl).query(query).$promise;
                    } else {
                        return crudResource(apiUrl);
                    }
                }
            }

            config = angular.extend(defaultConf, config);

            // Create the templateUrl for a route to our resource that does the specified operation.
            var templateUrl = function(operation) {
                return config.directory + '/views/' + config.tplPrefix + '.' + operation.toLowerCase() + '.html';
            };

            // Create the controller name for a route to our resource that does the specified operation.
            var controllerName = function(operation) {
                return config.ctrlPrefix + operation +'Ctrl';
            };

            var routeBuilder = {
                // Create a route that will handle showing a list of items
                whenList: function(resolveFns, query) {
                    routeBuilder.when(config.baseState, {
                        url: config.url+'?keyword&sort&order&page&fields&size',
                        templateUrl: templateUrl('List'),
                        controller: controllerName('List') + ' as ctrl',
                        resolve: angular.extend({}, resolveFns, itemsResolve(config.apiUrl, query)),
                        baseState: config.baseState,
                        apiUrl: config.apiUrl
                    });
                    return routeBuilder;
                },
                // Create a route that will handle creating a new item
                whenNew: function(resolveFns) {
                    routeBuilder.when(config.baseState + '-new', {
                        url: config.url+'/new',
                        templateUrl: templateUrl('New'),
                        controller: controllerName('New') + ' as ctrl',
                        resolve: angular.extend({}, resolveFns, itemResolve(config.apiUrl)),
                        baseState: config.baseState,
                        apiUrl: config.apiUrl
                    });
                    return routeBuilder;
                },
                // Create a route that will handle editing an existing item
                whenEdit: function(resolveFns, query) {
                    routeBuilder.when(config.baseState + '-edit', {
                        url: config.url+'/edit/:id',
                        templateUrl: templateUrl('Edit'),
                        controller: controllerName('Edit') + ' as ctrl',
                        resolve: angular.extend({}, resolveFns, itemResolve(config.apiUrl, query)),
                        baseState: config.baseState,
                        apiUrl: config.apiUrl
                    });
                    return routeBuilder;
                },
                // Pass-through to `$stateProvider.when()`
                when: function(path, route) {
                    $stateProvider.state(path, route);
                    return routeBuilder;
                },
                // Pass-through to `$stateProvider.otherwise()`
                otherwise: function(params) {
                    $stateProvider.otherwise(params);
                    return routeBuilder;
                },
                // Access to the core $stateProvider.
                $routeProvider: $stateProvider
            };

            return routeBuilder;
        }
    }


    function validate(config) {
        //check if baseState is defined
        if (config.baseState == null) {
            throw new CrudException('You must define the baseState param');
        }

        //check auth array
        if (config.auth != null && !config.auth.isArray) {
            throw new CrudException('Auth param must be an array of roles');
        }
    }

    function titleCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

})();


(function () {
    'use strict';

    angular
        .module('crud')
        .service('crudParameters', crudParameters);

    crudParameters.$inject = [];

    /* @ngInject */
    function crudParameters() {

        return {
            all: function (params) {

                //default pagination
                var itemsPerPage = 5;

                var limit   = parseInt(typeof params.size != 'undefined' && params.size.match(/^(100|[1-9][0-9]?)$/) ? params.size : itemsPerPage);
                var page    = parseInt((typeof params.page != 'undefined') && params.page.match(/^[0-9]+$/) ? params.page : 1);
                var sort    = params.sort;
                var order   = params.order;
                var keyword = params.keyword;
                var fields  = params.fields;


                return {
                    'pagination': limit,
                    'page': page,
                    'keyword': keyword,
                    'filterFields': fields,
                    'sortBy': sort,
                    'direction': order == 'asc' ? 'ASC' : order == 'desc' ? 'DESC' : null
                };
            },
            count: function (params) {

                var keyword = params.keyword;
                var fields  = params.fields;

                return {
                    'keyword': keyword,
                    'filterFields': fields
                }
            }
        };
    }

})();


(function () {
    'use strict';

    angular
        .module('crud')
        .service('crudResource', crudResource);

    crudResource.$inject = ['$resource', 'crudConfig'];

    /* @ngInject */
    function crudResource($resource, crudConfig)
    {
        return get;

        ////////////////

        function get(url, params) {
            params = params || {};
            var config = {
                'query' : { method: 'GET', isArray: false},
                'update': { method: 'PATCH' },
                'replace': { method: 'PUT'}
            };

            return $resource(crudConfig.baseApiUrl + url + '/:id', params, config);
        }
    }

})();

