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