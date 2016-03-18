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