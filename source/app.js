'use strict';

import angular from 'angular';
//import uiRouter from 'angular-ui/ui-router';

import IndexTemplate from './views/index.html!text'


angular.module('app', ['ui.router'])
    .config(($locationProvider, $stateProvider, $urlRouterProvider) => {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('index', {
                url: '/',
                template: 'IndexTemplate'
            })
            .state('index.sign_in', {
                url: '/sign_in',
                template: 'SignInTemplate'
            });

    })
    .run(run)
    //.controller('BaseCtrl', BaseCtrl);


angular.element(document).ready(
    () => angular.bootstrap(document, ['app'], {strictDi: true})
);