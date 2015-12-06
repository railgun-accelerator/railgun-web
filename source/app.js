'use strict';

import 'angular'
import 'angular-ui-router'

import IndexHeaderTemplate from './views/index.header.html!text'
import IndexBodyTemplate from './views/index.body.html!text'
import IndexTemplate from './views/index.html!text'
import SignInTemplate from './views/sign_in.html!text'
import SignUpTemplate from './views/sign_up.html!text'


angular.module('app', ['ui.router'])
    .config(($locationProvider, $stateProvider, $urlRouterProvider) => {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('index', {
                views: {
                    "header": {template: IndexHeaderTemplate},
                    "body": {template: IndexBodyTemplate},
                }
            })
            .state('index.index', {
                url: '/',
                template: IndexTemplate
            })
            .state('index.sign_in', {
                url: 'sign_in',
                template: SignInTemplate
            });

    })
    .run(() => {
        console.log(1);
    });
    //.controller('BaseCtrl', BaseCtrl);


angular.bootstrap(document, ['app']);