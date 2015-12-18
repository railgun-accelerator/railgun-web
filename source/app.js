'use strict';

import 'angular'
import 'angular-messages'
import 'angular-material'
import 'angular-ui-router'
import 'angular-ui/ui-validate'
import 'auth0/angular-storage'
import 'ivpusic/angular-cookie'
import 'lynndylanhurley/ng-token-auth'
import 'angular-translate'
import 'angular-i18n/zh-cn'
import 'babel/external-helpers'
import 'Swimlane/angular-data-table'
import 'Swimlane/angular-data-table/release/dataTable.css!'
import 'Swimlane/angular-data-table/release/material.css!'
import moment from 'moment'
import 'taijinlee/humanize'
import 'saymedia/angularjs-humanize'
import 'angular-marked' //没有用到
import qrcode from 'qrcode-generator'
import 'angular-qrcode'
import crypto from 'crypto'

//import 'LeaVerou/prefixfree'
import 'font-awesome'
import 'adobe-fonts/source-sans-pro/source-sans-pro.css!'

import IndexHeaderTemplate from './views/index.header.html!text'
import IndexBodyTemplate from './views/index.body.html!text'
import IndexTemplate from './views/index.html!text'
import SignInTemplate from './views/sign_in.html!text'
import SignUpTemplate from './views/sign_up.html!text'
import PasswordReset1Template from './views/password_reset_1.html!text'
import PasswordReset2Template from './views/password_reset_2.html!text'
import HomeHeaderTemplate from './views/home.header.html!text'
import HomeBodyTemplate from './views/home.body.html!text'
import HomeTemplate from './views/home.html!text'
import InvoicesTemplate from './views/invoices.html!text'
import ActivitiesTemplate from './views/activities.html!text'
import TutorialsTemplate from './views/tutorials.html!text'

window.qrcode = qrcode;

angular.module('app', ['ngLocale', 'ngMaterial', 'ngMessages', 'ui.router', 'ui.validate', 'angular-storage', 'ng-token-auth', 'pascalprecht.translate', 'data-table', 'angular-humanize', 'hc.marked', 'monospaced.qrcode'])
    .config(($locationProvider, $stateProvider, $urlRouterProvider) => {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('index', {
                abstract: true,
                views: {
                    "header": {template: IndexHeaderTemplate},
                    "body": {template: IndexBodyTemplate}
                }
            })
            .state('index.index', {
                url: '/',
                template: IndexTemplate
            })
            .state('index.sign_in', {
                url: '^/sign_in',
                template: SignInTemplate,
                controller: 'SignInController'
            })
            .state('index.sign_up', {
                url: '^/sign_up?code',
                template: SignUpTemplate,
                controller: 'SignUpController'
            })
            .state('index.password_reset_1', {
                url: '^/password_reset',
                template: PasswordReset1Template
            })
            .state('index.password_reset_2', {
                url: '^/password_reset/:code',
                template: PasswordReset2Template
            })
            .state('email_verify', {
                url: '^/email_verify/:code',
                controller: 'EmailVerifyController'
            })
            .state('home', {
                abstract: true,
                views: {
                    "header": {template: HomeHeaderTemplate},
                    "body": {template: HomeBodyTemplate}
                }
            })
            .state('home.index', {
                url: '^/my',
                template: HomeTemplate,
                controller: 'HomeController'
            })
            .state('home.tutorials', {
                url: '^/my/tutorials/:platform',
                template: TutorialsTemplate,
                controller: 'TutorialsController'
            })
            .state('home.invoices', {
                url: '^/my/invoices',
                template: InvoicesTemplate,
                controller: 'InvoicesController'
            })
            .state('home.activities', {
                url: '^/my/activities',
                template: ActivitiesTemplate,
                controller: 'ActivitiesController'
            })

    })
    .config(($authProvider)=> {
        $authProvider.configure({
            apiUrl: 'https://dev.railgun.ac/api',
            emailRegistrationPath: '/auth',
            emailSignInPath: '/sign_in',
            tokenValidationPath: '/sign_in',
            signOutUrl: '/sign_in',
            passwordUpdatePath: '/user/password',
            forceValidateToken: true,
            tokenFormat: {
                "Authorization": "{{ token }}"
            },
            parseExpiry: function (headers) {
                // convert from UTC ruby (seconds) to UTC js (milliseconds)
                return new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000;
            },
            handleLoginResponse: (response) => {
                return response;
            },
            handleTokenValidationResponse: (response)=> {
                return response;
            }
        })
    })
    .config(($translateProvider)=> {
        $translateProvider.translations('zh-CN', {
            status: {
                0: '等待邮箱验证',
                1: '余额不足',
                2: '状态正常'
            },
            zone: {
                h: '中国',
                j: '亚太',
                a: '北美'
            },
            plan: {
                1: '未选择',
                2: 'Level 2',
                3: 'Level 3',
                4: 'Level 4',
                5: 'Level 5'
            },
            protocol: {
                1: 'HTTP 代理',
                2: 'HTTPS 代理',
                3: 'Socks 代理',
                4: 'Shadowsocks',
                5: 'VPN'
            },
            invoice_type: {
                1: '充值',
                2: '流量消费',
                3: '套餐消费',
                4: '礼品卡',
                '-1': '充值撤销',
                '-3': '套餐撤销'
            },
            invoice_status: {
                0: '待付款',
                1: '已完成',
                2: '已取消',
                3: '等待确认收货'
            }
        });
        $translateProvider.preferredLanguage('zh-CN');
        $translateProvider.useSanitizeValueStrategy(null);
    })
    .run(($rootScope, $state, $auth) => {
        $rootScope.$state = $state;
        function onLogin(event) {
            $rootScope.user = event.targetScope.user;
            $rootScope.user.sub_password_2 = parseInt($rootScope.user.sub_password) + 1;
            $rootScope.user.sub_password_3 = parseInt($rootScope.user.sub_password) + 2;
            $rootScope.user.sub_password_4 = parseInt($rootScope.user.sub_password) + 3;
            $rootScope.user.avatar = 'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update($rootScope.user.email).digest('hex') + '?s=120';
            $rootScope.user.shadowsocks_url = 'ss://' + btoa('aes-256-cfb:railgun@'+ $rootScope.user.zone +'.lv5.ac:' + $rootScope.user.sub_password_4);
            console.log($rootScope.user.shadowsocks_url)
            $state.go('home.index');
        }

        $rootScope.$on('auth:login-success', onLogin);
        $rootScope.$on('auth:validation-success', onLogin);
        $rootScope.$on('auth:validation-error', (event) => {
            console.log('auth:validation-error')
        });
        $rootScope.$on('auth:session-expired', (event) => {
            console.log('auth:session-expired')
        });
        $auth.validateUser();
        //console.log(1);
    })
    .controller('SignInController', ($scope, $auth)=> {
        $scope.submit = ()=> {
            $auth.submitLogin($scope.user)
                .then((response)=> {
                    $auth.setAuthHeaders($auth.buildAuthHeaders({
                        token: response.token
                    }));
                    console.log('success', response)
                })
                .catch((response)=> {
                    console.log('fail', response)
                })
        }
    })
    .controller('SignUpController', ($scope, $stateParams, $http)=> {
        $scope.user = {code: $stateParams.code};
        $scope.submit = ()=> {
            $http.put('https://railgun.ac/api/sign_up', $scope.user).then((response) => {
                console.log('success', response)
            }, (response) => {
                console.log('fail', response)
            })
        }
    })
    .controller('EmailVerifyController', ($scope, $stateParams)=> {
        console.log($stateParams.code)
    })
    .controller('HomeController', ($scope, $auth, $state, $compile, $sce)=> {
        $scope.sign_out = () => {
            $auth.signOut();
            $state.go('index.index')
        };
        // fucking platfo
        // rm.js , I had to parse User-Agent manually.
        switch (true) {
            case /Windows/.test(navigator.userAgent):
                $scope.tutorial = 'windows';
                break;
            case /Android/.test(navigator.userAgent):
                $scope.tutorial = 'android';
                break;
            case /iP(ad|od|hone)/.test(navigator.userAgent):
                $scope.tutorial = 'ios';
                break;
            case /(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/.test(navigator.userAgent):
                $scope.tutorial = 'osx';
                break;
            case /(Linux|X11)/.test(navigator.userAgent):
                $scope.tutorial = 'linux';
                break;
        }
        if($scope.tutorial){
            $scope.tutorial = '/source/views/tutorials/' + $scope.tutorial + '.lite.html'
        }


    })
    .controller('InvoicesController', ($scope, $http, $rootScope)=> {
        $scope.zone_id = $rootScope.user.zone;
        $scope.plan_id = $rootScope.user.plan;
        const plans_enabled = [2, 3, 4];
        $scope.billing_expire = moment($rootScope.user.last_billing_day * 1000).add(15, 'days');
        if ($scope.billing_expire.date() > $rootScope.user.billing_date) {
            $scope.billing_expire.date($rootScope.user.billing_date);
            $scope.billing_expire.add(1, 'month')
        } else {
            $scope.billing_expire.date($rootScope.user.billing_date)
        }
        $scope.billing_expire.subtract(1, 'day');
        $scope.billing_expire = $scope.billing_expire.toDate();
        $scope.zones = [
            {id: 'h'},
            {id: 'j'},
            {id: 'a'}
        ];
        $scope.price_plans = {
            1: {id: 1, price: 3579139},
            4: {id: 4, price: 5368709},
            3: {id: 3, price: 4294967}
        };
        $http.get('https://dev.railgun.ac/api/plan')
            .then((response)=> {
                $scope.plans = response.data.filter((plan)=> {
                    return plans_enabled.includes(plan.id)
                }).sort((a, b)=> {
                    return +(a.price > b.price) || +(a.price === b.price) - 1
                });
            });
        $http.get('https://dev.railgun.ac/api/invoice')
            .then((response)=> {
                $scope.data = response.data
            })
    })
    .controller('ActivitiesController', ($scope, $rootScope, $http, $mdDialog, $auth, $mdToast)=> {
        $scope.options = {};
        if ($rootScope.user.id) {
            $http.get('https://railgun.ac/api/activities', {params: {user_id: $rootScope.user.id}})
                .then((response)=> {
                    $scope.data = response.data
                })
        }
        $scope.changePassword = (event) => {
            $auth.updatePassword($scope.user)
                .then((response)=> {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('修改登录密码成功')
                            .position('bottom left')
                    )
                }, (response)=> {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('修改登录密码失败')
                            .content('You can specify some description text in here.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('确定')
                            .targetEvent(event)
                    );
                })
        };
        $scope.resetSubPassword = (event) => {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show(
                $mdDialog.confirm()
                    .title('确定要重置服务密码?')
                    .content('重置后需要参照连接说明在设备上重新设置代理或 VPN 连接。')
                    .ariaLabel('Lucky day')
                    .targetEvent(event)
                    .ok('重置')
                    .cancel('取消')
            ).then(()=> {
                    $http.get('https://dev.railgun.ac/api/zone', {zone: $rootScope.user.zone})
                        .then(()=> {
                            $mdToast.show(
                                $mdToast.simple()
                                    .content('重置服务密码成功')
                                    .position('bottom left')
                            )
                        }, ()=> {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('重置服务密码失败')
                                    .content('You can specify some description text in here.')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('确定')
                                    .targetEvent(event)
                            );
                        })
                });
        };
    })
    .controller('TutorialsController', ($scope, $stateParams)=>{
        console.log($stateParams)
        $scope.tutorial = '/source/views/tutorials/' + $stateParams.platform + '.html'
    })
    .directive('selectOnClick', () => {
        return {
            restrict: 'A',
            link: (scope, element, attrs) => {
                element.on('focus', (event) => {
                    event.target.select()
                });
            }
        };
    })

angular.bootstrap(document, ['app']);