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

