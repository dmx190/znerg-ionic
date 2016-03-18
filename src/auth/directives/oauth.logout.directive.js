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

