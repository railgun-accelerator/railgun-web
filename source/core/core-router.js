// source/core/core-router.js
import HomeRoute from 'source/states/home/home-route'

function CoreRouter($stateProvider) {
    $stateProvider
        // Home
        .state('home', HomeRoute)

    // Session
    // .state('session',        SessionRoute)
    // .state('session.signin', SessionSigninRoute)
    // .state('session.signup', SessionSignupRoute)
}

CoreRouter.$inject = ['$stateProvider']

export default CoreRouter