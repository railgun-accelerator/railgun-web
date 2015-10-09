angular.module 'Railgun', ['ngMaterial', 'ngMessages', 'ui.router', 'ng-token-auth', 'adaptive.detection', 'datatables']
.config ['$stateProvider', '$urlRouterProvider', '$locationProvider',
  ($stateProvider, $urlRouterProvider, $locationProvider)->
    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state('welcome', {
        abstract: true,
        views: {
          "header": {templateUrl: "partials/welcome.header.html"},
          "body": {templateUrl: "partials/welcome.body.html"}
        }
      })
    .state('welcome.index', {
        url: "/",
        templateUrl: "partials/welcome.index.html"
      })
    .state('welcome.sign_in', {
        url: "^/sign_in",
        templateUrl: "partials/welcome.sign_in.html",
        controller: 'SignInController'
      })
    .state('welcome.sign_up', {
        url: "^/sign_up",
        templateUrl: "partials/welcome.sign_up.html",
        controller: 'SignUpController'
      })
    .state('my', {
        abstract: true,
        views: {
          "header": {templateUrl: "partials/my.header.html", controller: 'MyController'},
          "body": {templateUrl: "partials/my.body.html"}
        }

      })
    .state('my.index', {
        url: "^/my",
        templateUrl: "partials/my.index.html"
        controller: 'MyController'
      })
    .state('my.tutorial', {
        abstract: true,
        templateUrl: "partials/my.tutorial.html"
      })
    .state('my.tutorial.windows', {
        url: "^/my/windows",
        templateUrl: "docs/windows.html"
      })
    .state('my.plan', {
        url: "^/my/plan",
        templateUrl: "partials/my.plan.html"
        controller: 'PlanController'
      })
    .state('my.account', {
        url: "^/my/account",
        templateUrl: "partials/my.account.html"
        controller: 'AccountController'
      })
    .state('my.security', {
        url: "^/my/security",
        templateUrl: "partials/my.security.html"
        controller: 'SecurityController'
      })
]
.config ['$authProvider', ($authProvider)->
  $authProvider.configure
    apiUrl: 'https://railgun.ac/api'
]
.config ['$mdThemingProvider', ($mdThemingProvider)->
  $mdThemingProvider
  .theme('default')
  .primaryPalette('indigo')
  .accentPalette('pink')
  .warnPalette('red')
  .backgroundPalette('grey')
]
.controller "SignInController", ['$scope', '$auth', '$state', ($scope, $auth, $state) ->
  $scope.sign_in = (user)->
    #$auth.submitLogin(user)
    alert('系统还没写好呢喵，申请内测账号或使用遇到问题请邮件至 support@railgun.ac')
    #.then (response)->
    #  $state.go('my.index')
    #.catch (response)->
    #  console.log response
]

.controller 'SignUpController', ['$scope', '$auth', '$state', ($scope, $auth, $state)->
  $scope.sign_up = (user)->
    alert('系统还没写好呢喵，申请内测账号或使用遇到问题请邮件至 support@railgun.ac')
    #$auth.submitRegistration(user)
    #.then (response)->
    #  null
      #alert('已发送注册邮件');
      #$state.go('my.index')
    #.catch (response)->
    #  null
      #console.log response
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
.controller 'MyController', ['$scope', '$auth', '$state', ($scope, $auth, $state)->
  $scope.platform = 'windows'
  $scope.user = {
    avatar_url: 'https://secure.gravatar.com/avatar/' + CryptoJS.MD5('zh99998@gmail.com'.toLowerCase().trim()).toString() + '?s=120&d=retro'
  }
]
.controller 'SecurityController', ['$scope', ($scope)->
    moment.locale('zh-CN')
    tz = jstz.determine().name()
    $scope.dtOptions = {
      ajax: '/api/activities',
      order: [[ 2, "desc" ]]
      initComplete: (settings, json)->
        $(@context).parents('.dataTables_wrapper').children('.dataTables_title').html('帐户历史记录')
    }
    $scope.dtColumns = [
      {data: 'service', title: '服务类型', className: "dt-left", render: (data, type)-> if type is 'display' and data? then [null,null,null,'VPN'][data] else data}
      {data: 'protocol', title: '协议', className: "dt-left", render: (data, type)-> if type is 'display' and data? then [null,'IKEv2','IPSec XAuth PSK','IPSec XAuth PSK','IPSec Hybrid RSA', 'IPSec Hybrid RSA','','','OpenConnect', 'OpenVPN'][data] else data}
      {data: 'started_at', title: '起始时间', className: "dt-left", render: (data, type)-> if type is 'display' and data? then moment(data).tz(tz).format('YYYY-MM-DD HH:mm:ss') else data}
      {data: 'ended_at', title: '终止时间', className: "dt-left", render: (data, type)-> if type is 'display' and data? then moment(data).tz(tz).format('YYYY-MM-DD HH:mm:ss') else data}
      {data: 'traffic', title: '流量', className: "dt-right", render: (data, type)-> if type is 'display' and data? then humanize.filesize(data) else data}
      {data: 'duration', title: '时长', className: "dt-right", render: (data, type)-> if type is 'display' and data? then moment.duration(data, 'seconds').humanize() else data}
      {data: 'client_ip_address', className: "dt-left", title: '来源IP地址'}
      {data: 'location', className: "dt-left", title: '来源地区'}
    ];
]
.controller 'PlanController', ['$scope', ($scope)->
  $scope.region_id = 2
  $scope.zone_id = 'h'
  $scope.regions = [
    {id: 1, name: "北美"}
    {id: 2, name: "中国大陆"}
    {id: 3, name: "亚太"}
  ]
  $scope.zones = [
    {id: 'a', region_id: 1,name:"美国西部"}
    {id: 'h', region_id: 2, name: "中国东部"}
    {id: 'j', region_id: 3, name: "日本"}
  ]
]
.controller 'AccountController', ['$scope', ($scope)->
  $scope.dtOptions = {
    #ajax: '/api/activities',
    order: [[ 0, "desc" ]]
    initComplete: (settings, json)->
      $(@context).parents('.dataTables_wrapper').children('.dataTables_title').html('账单历史')
  }
  $scope.showmore = false
]
.run ($rootScope, $state, DTDefaultOptions)->
  $rootScope.$state = $state;
  $.extend $.fn.dataTable.defaults,
    pagingType: 'simple'
    dom: '<"dataTables_title">frt<"dataTables_footer"lip>'
    scrollX: "100%"
    language:
      processing:   "处理中...",
      lengthMenu:   "每页显示 _MENU_ 项结果",
      zeroRecords:  "没有匹配结果",
      info:         "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
      infoEmpty:    "显示第 0 至 0 项结果，共 0 项",
      infoFiltered: "(由 _MAX_ 项结果过滤)",
      infoPostFix:  "",
      search:       "",
      searchPlaceholder: "搜索"
      emptyTable:     "表中数据为空",
      loadingRecords: "载入中...",
      infoThousands:  ",",
      paginate:
        first:    "首页",
        previous: "上页",
        next:     "下页",
        last:     "末页"
      aria:
        sortAscending:  ": 以升序排列此列",
        sortDescending: ": 以降序排列此列"

.directive 'navItem', ->
  link: (scope, element)->
    element.bind "mouseenter", ->
      console.log element[0].offsetLeft