

 var Molliapp = angular.module('myApp', ["ui.router", "ngAnimate"])
    Molliapp.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/route1")
      
      $stateProvider
         .state('route1', {
            //////this is the most popular page
            url: "/route1",
            templateUrl: "home",
            controller: function($scope,$http, $stateParams){
                 $http({
                    method : "GET",
                    url : "http://127.0.0.1:3000/api/montage/recent"
                  }).then(function mySucces(response) {
                      $scope.results = response.data.results;
                    }, function myError(response) {
                      $scope.results = response.statusText;
                  });

            }
        })
        .state('route2', {
            ////////////this is the most recent page!
            url: "/route2",
            templateUrl: "route2",
            controller: function($scope,$http, $stateParams){
                $http({
                    method : "GET",
                    url : "http://127.0.0.1:3000/api/montage/recent"
                  }).then(function mySucces(response) {
                      $scope.results = response.data.results;
                    }, function myError(response) {
                      $scope.results = response.statusText;
                  });
            }
        })
        .state('route3', {
            ////////////this is the my montages page
            url: "/route3",
            templateUrl: "route3",
            controller: function($scope,$http, $stateParams){
                $http({
                    method : "GET",
                    url : "http://api.icndb.com/jokes/random?firstName=John&amp;lastName=Doe"
                  }).then(function mySucces(response) {
                      $scope.welcome = response.data;
                    }, function myError(response) {
                      $scope.welcome = response.statusText;
                  });
            }
    })
})


