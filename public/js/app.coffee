angular.module('railgun', [
  'ngRoute'
  'ngAnimate'
  'ng-token-auth'
]).config ['$routeProvider', '$locationProvider', '$authProvider', ($routeProvider, $locationProvider, $authProvider) ->

  $authProvider.configure({
    apiUrl: 'http://hz.railgun.ac:45678'
  })

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.otherwise redirectTo: '/'
  .when('/', {
    templateUrl: 'views/index.html',
    controller: 'IndexController'
  })
  .when('/sign_in', {
    templateUrl: 'views/sign_in.html',
    controller: 'SignInController'
  })
  .when('/sign_up', {
    templateUrl: 'views/sign_up.html',
    controller: 'SignUpController'
  })

]
.controller('IndexController', [ ->
    console.log 'home'
])
.controller('SignInController', [ ->
    console.log 'sign_in'
])

.controller('SignUpController', [ '$scope', '$auth', ($scope, $auth)->
    $scope.status = 'input'
    $scope.submit = (user)->
      $scope.status = 'loading'
      $auth.submitRegistration(user)
      .then (resp)->
        console.log resp
        $scope.status = 'success'
      .catch (response)->
        $scope.errors = response.data.fields
        $scope.status = 'input'
])

.directive 'remote', ($q, $timeout, $http)->
  require: 'ngModel',
  link: (scope, elm, attrs, ctrl)->
    ctrl.$asyncValidators.remote = (modelValue, viewValue)->
      params = {}
      params[attrs.name] = modelValue
      $http.get("http://hz.railgun.rocks:45678/auth", params: params)
      .then (response)->
        true
      .catch (response)->
        $q.reject(response.data.error)