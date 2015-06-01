angular.module 'Railgun', [ 'ngMaterial', 'ngMessages', 'ui.router' ]
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
    })
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
.run ($rootScope, $state)->
  $rootScope.$state = $state;

.directive 'navItem', ->
  link: (scope, element)->
    element.bind "mouseenter", ->
      console.log element[0].offsetLeft