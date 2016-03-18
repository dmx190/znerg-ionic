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

