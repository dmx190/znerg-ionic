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

