

 var myapp = angular.module('myApp', ["ui.router", "ngAnimate"])
    myapp.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/route1")
      
      $stateProvider
        .state('route2', {
            url: "/route2",
            templateUrl: "/routepokemon",
            controller: function($scope,$stateParams){
            	$scope.Pokemon_description = Pokemon_info[$stateParams["pokemonid"]];
    
            }
        })
        .state('route1', {
            url: "/route1",
            templateUrl: "/home",
            controller: function($scope,$stateParams){

          
        }
    })

})


