angular.module 'Railgun', [ 'ngMaterial', 'ngMessages', 'ui.router', 'ng-token-auth' ]
.config ['$stateProvider', '$urlRouterProvider', '$locationProvider', ($stateProvider, $urlRouterProvider, $locationProvider)->
  $locationProvider.html5Mode(true)
  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('index', {
    abstract: true,
    views: {
      "header": { templateUrl: "partials/index.header.html" },
      "body": { templateUrl: "partials/index.body.html" }
    },
    class: "index"
  })
  .state('index.index', {
      url: "/",
      templateUrl: "partials/index.index.html"
      class: "index"
    })
  .state('index.sign_in', {
    url: "^/sign_in",
    templateUrl: "partials/index.sign_in.html",
  })
  .state('index.sign_up', {
      url: "^/sign_up",
      templateUrl: "partials/index.sign_up.html",
      controller: 'SignUpController'
    })
]
.config ['$authProvider', ($authProvider)->
  $authProvider.configure
    apiUrl: 'https://railgun.ac/api'
]

.controller "SignInController", ['$scope', '$rootScope', ($scope, $rootScope) ->
  $scope.user = {
    name: 'John Doe',
    email: '',
    phone: '',
    address: 'Mountain View, CA'
  }
  console.log $rootScope.state
]

.controller 'SignUpController', [ '$scope', '$auth', ($scope, $auth)->
  console.log $scope
  $scope.sign_up = (user)->
    console.log(1)
    $auth.submitRegistration(user)
    .then (response)->
      console.log response
    .catch (response)->
      console.log response
#  $scope.status = 'input'
#  $scope.submit = (user)->
#    $scope.status = 'loading'
#    $auth.submitRegistration(user)
#    .then (resp)->
#      console.log resp
#      $scope.status = 'success'
#    .catch (response)->
#      $scope.errors = response.data.fields
#      $scope.status = 'input'
]

.run ($rootScope, $state)->
  $rootScope.$state = $state;

.directive 'navItem', ->
  link: (scope, element)->
    element.bind "mouseenter", ->
      console.log element[0].offsetLeft