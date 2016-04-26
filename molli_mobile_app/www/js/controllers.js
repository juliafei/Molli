angular.module('starter.controllers', ['ionic', 'starter.services'])

.controller('login_controller', function($scope, $http, $ionicPopup, $ionicModal, $timeout, molliAuth) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
   
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var formData = new FormData();
        formData.append("username", $scope.username);
        formData.append("password", $scope.password);
    $http({
            method  : 'POST',
            url     : 'http://127.0.0.1:3000/api/login',
            headers : { 'Content-Type': undefined },
            data    :  formData
           })
        .then(function mySucces(response) {
              if(response.data.success != false){
                  
              }
              else{
                  $ionicPopup.alert({
                     title: 'Wrong username/password',
                     template: response.data.message
                   });
              }          
            }, function myError(response) {
              console.log(response.statusText);
          });    

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('create_montage_controller', function($scope, $http) {
  $scope.videosAdded = 0;

  /////triggers hidden html5 file input element.
  $scope.choose_vids = function(){
    ionic.trigger('click', { target: document.getElementById('molli_vids')});
  };  

  $scope.addedVideo = function(){
    $scope.videosAdded = document.getElementById('molli_vids').files.length;
  };

   $scope.sendVideosToApi = function() {
        var formData = new FormData();
        formData.append("title", "Groucho");
        /////getting all videos from html form file input and appending them to data posted to API
        for(i=0;i<document.getElementById('molli_vids').files.length;i++){
          formData.append("videos", document.getElementById('molli_vids').files[i]);
        };
        console.log("this is being called");
        $http({
            method  : 'POST',
            url     : 'http://127.0.0.1:3000/api/montage/new',
            headers : { 'Content-Type': undefined },
            data    :  formData
           })
        .then(function mySucces(response) {
              console.log(response.data);
            }, function myError(response) {
              console.log(response.statusText);
          });
    } 
})

.controller('home_controller', function($scope, $stateParams) {
});
