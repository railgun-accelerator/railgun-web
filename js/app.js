'use strict';

angular.module('app', ['ngLocale', 'ngMaterial', 'ngMessages', 'ui.router', 'ui.validate', 'ng-token-auth', 'pascalprecht.translate', 'data-table', 'angular-humanize', 'monospaced.qrcode'])
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('index', {
                abstract: true,
                views: {
                    "header": {templateUrl: '/views/index.header.html'},
                    "body": {templateUrl: '/views/index.body.html'}
                }
            })
            .state('index.index', {
                url: '/',
                templateUrl: '/views/index.html'
            })
            .state('index.sign_in', {
                url: '^/sign_in?go',
                templateUrl: '/views/sign_in.html',
                controller: 'SignInController'
            })
            .state('index.sign_up', {
                url: '^/sign_up?code',
                templateUrl: '/views/sign_up.html',
                controller: 'SignUpController'
            })
            .state('index.password_reset_1', {
                url: '^/password_reset',
                templateUrl: '/views/passsword_reset_1.html'
            })
            .state('index.password_reset_2', {
                url: '^/password_reset/:code',
                templateUrl: '/views/passsword_reset_2.html'
            })
            .state('email_verify', {
                url: '^/email_verify/:code',
                controller: 'EmailVerifyController'
            })
            .state('home', {
                abstract: true,
                views: {
                    "header": {templateUrl: '/views/home.header.html'},
                    "body": {templateUrl: '/views/home.body.html'}
                }
            })
            .state('home.index', {
                url: '^/my',
                templateUrl: '/views/home.html',
                controller: 'HomeController'
            })
            .state('home.tutorials', {
                url: '^/my/tutorials/:platform',
                templateUrl: '/views/tutorials.html',
                controller: 'TutorialsController'
            })
            .state('home.invoices', {
                url: '^/my/invoices',
                templateUrl: '/views/invoices.html',
                controller: 'InvoicesController'
            })
            .state('home.activities', {
                url: '^/my/activities',
                templateUrl: '/views/activities.html',
                controller: 'ActivitiesController'
            })

    })
    .config(function ($authProvider, api) {
        $authProvider.configure({
            apiUrl: api,
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
            handleLoginResponse: function (response) {
                return response;
            },
            handleTokenValidationResponse: function (response) {
                return response;
            }
        })
    })
    .config(function ($translateProvider) {
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
    .run(function ($rootScope, $state, $stateParams, $auth) {
        $rootScope.$state = $state;
        function onLogin(event) {
            $rootScope.user = event.targetScope.user;
            $rootScope.user.sub_password_2 = parseInt($rootScope.user.sub_password) + 1;
            $rootScope.user.sub_password_3 = parseInt($rootScope.user.sub_password) + 2;
            $rootScope.user.sub_password_4 = parseInt($rootScope.user.sub_password) + 3;
            $rootScope.user.avatar = 'https://www.gravatar.com/avatar/' + md5($rootScope.user.email) + '?s=120';
            $rootScope.user.shadowsocks_url = 'ss://' + btoa('aes-256-cfb:railgun@' + $rootScope.user.zone + '.lv5.ac:' + $rootScope.user.sub_password_4);
            $rootScope.user.support_url = "https://support.railgun.ac/?jwt=" + KJUR.jws.JWS.sign("HS256", JSON.stringify({
                    alg: 'HS256',
                    typ: 'JWT'
                }), {
                    name: $rootScope.user.username,
                    external_id: $rootScope.user.id,
                    email: $rootScope.user.email
                }, "-J74poBLHieUHPMSpFsPMw");
            if ($stateParams.go == 'support') {
                location.href = "https://support.railgun.ac/?jwt=" + jwt
            } else {
                $state.go('home.index');
            }

        }

        $rootScope.$on('auth:login-success', onLogin);
        $rootScope.$on('auth:validation-success', onLogin);
        $rootScope.$on('auth:validation-error', function (event) {
            console.log('auth:validation-error')
        });
        $rootScope.$on('auth:session-expired', function (event) {
            console.log('auth:session-expired')
        });
        $auth.validateUser();
        //console.log(1);
    })
    .controller('SignInController', function ($scope, $auth) {
        $scope.submit = function () {
            $auth.submitLogin($scope.user)
                .then(function (response) {
                    $auth.setAuthHeaders($auth.buildAuthHeaders({
                        token: response.token
                    }));
                    console.log('success', response)
                })
                .catch(function (response) {
                    console.log('fail', response)
                })
        }
    })
    .controller('SignUpController', function ($scope, $stateParams, $http) {
        $scope.user = {code: $stateParams.code};
        $scope.submit = function (api) {
            $http.put(api + '/sign_up', $scope.user).then(function (response) {
                console.log('success', response)
            }, function (response) {
                console.log('fail', response)
            })
        }
    })
    .controller('EmailVerifyController', function ($scope, $stateParams) {
        console.log($stateParams.code)
    })
    .controller('HomeController', function ($scope, $auth, $state, $compile, $sce) {
        $scope.sign_out = function () {
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
        if ($scope.tutorial) {
            $scope.tutorial = '/views/tutorials/' + $scope.tutorial + '.lite.html'
        }


    })
    .controller('InvoicesController', function ($scope, $http, $rootScope, api) {
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
        $http.get(api + '/plan')
            .then(function (response) {
                $scope.plans = response.data.filter(function (plan) {
                    return plans_enabled.includes(plan.id)
                }).sort(function (a, b) {
                    return +(a.price > b.price) || +(a.price === b.price) - 1
                });
            });
        $http.get(api + '/invoice')
            .then(function (response) {
                $scope.data = response.data
            })
    })
    .controller('ActivitiesController', function ($scope, $rootScope, $http, $mdDialog, $auth, $mdToast) {
        $scope.options = {};
        if ($rootScope.user.id) {
            $http.get(api + '/activities', {params: {user_id: $rootScope.user.id}})
                .then(function (response) {
                    $scope.data = response.data
                })
        }
        $scope.changePassword = function (event) {
            $auth.updatePassword($scope.user)
                .then(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('修改登录密码成功')
                            .position('bottom left')
                    )
                }, function (response) {
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
        $scope.resetSubPassword = function (event) {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show(
                $mdDialog.confirm()
                    .title('确定要重置服务密码?')
                    .content('重置后需要参照连接说明在设备上重新设置代理或 VPN 连接。')
                    .ariaLabel('Lucky day')
                    .targetEvent(event)
                    .ok('重置')
                    .cancel('取消')
            ).then(function () {
                $http.get(api + '/zone', {zone: $rootScope.user.zone})
                    .then(function () {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('重置服务密码成功')
                                .position('bottom left')
                        )
                    }, function () {
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
    .controller('TutorialsController', function ($scope, $stateParams) {
        console.log($stateParams)
        $scope.tutorial = '/views/tutorials/' + $stateParams.platform + '.html'
    })
    .directive('selectOnClick', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('focus', function (event) {
                    event.target.select()
                });
            }
        };
    })
    .constant('api', 'https://dev.railgun.ac/api');

angular.bootstrap(document, ['app']);