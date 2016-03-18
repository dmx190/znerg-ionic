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

