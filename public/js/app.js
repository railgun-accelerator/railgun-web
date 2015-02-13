// Generated by CoffeeScript 1.8.0
(function() {
  angular.module('railgun', ['ngRoute', 'ngAnimate', 'ng-token-auth']).config([
    '$routeProvider', '$locationProvider', '$authProvider', function($routeProvider, $locationProvider, $authProvider) {
      $authProvider.configure({
        apiUrl: 'http://hz.railgun.ac:45678'
      });
      $locationProvider.html5Mode(true).hashPrefix('!');
      return $routeProvider.otherwise({
        redirectTo: '/'
      }).when('/', {
        templateUrl: 'views/index.html',
        controller: 'IndexController'
      }).when('/sign_in', {
        templateUrl: 'views/sign_in.html',
        controller: 'SignInController'
      }).when('/sign_up', {
        templateUrl: 'views/sign_up.html',
        controller: 'SignUpController'
      });
    }
  ]).controller('IndexController', [
    function() {
      return console.log('home');
    }
  ]).controller('SignInController', [
    function() {
      return console.log('sign_in');
    }
  ]).controller('SignUpController', [
    '$scope', '$auth', function($scope, $auth) {
      $scope.status = 'input';
      return $scope.submit = function(user) {
        $scope.status = 'loading';
        return $auth.submitRegistration(user).then(function(resp) {
          console.log(resp);
          return $scope.status = 'success';
        })["catch"](function(response) {
          $scope.errors = response.data.fields;
          return $scope.status = 'input';
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=app.js.map