

 var Molliapp = angular.module('myApp', ["ui.router", "ngAnimate"])
    Molliapp.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/route1")
      
      $stateProvider
        .state('route2', {
            url: "/route2",
            templateUrl: "route2",
            controller: function($scope,$stateParams){

            }
        })
        .state('route1', {
            url: "/route1",
            templateUrl: "home",
            controller: function($scope,$stateParams){
          
        }
    })

})


