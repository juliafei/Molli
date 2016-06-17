angular.module('starter.controllers', ['ionic', 'starter.services'])

.controller('login_controller', function($scope, $state, $stateParams, $http, $ionicPopup, $ionicModal, $timeout, $ionicLoading) {
  console.log("controller set");
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  /*$scope.$on('$ionicView.enter', function(e) {
  });
*/
  // Form data for the login modal
  $scope.loginData = {};

  $scope.userInfo = {
    username: "",
    password: ""
  }; 

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
   console.log('wow');
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log("event fired");
    $ionicLoading.show({
          template: 'Loading...'
          });
    var formData = new FormData();
        formData.append("username", $scope.userInfo.username);
        formData.append("password", $scope.userInfo.password);
        
    $http({
            method  : 'POST',
            url     : 'http://Molli.tv/api/login',
            headers : { 'Content-Type': undefined },
            data    :  formData
           })
        .then(function mySucces(response) {
              $ionicLoading.hide();
              if(response.data.success === true){
                  $ionicLoading.hide();
                  localStorage.setItem("token", response.data.token);
                  $state.go("app.my_account");

              }
              else{
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                     title: 'Wrong username/password',
                     template: response.data.message
                   });
              }          
            }, function myError(response) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                     title: 'Connection Error',
                     template: 'Something is wrong with your connection. Try again later.'
                   });
          });    

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('sign_up_controller', function($scope, $stateParams, $http, $state, $ionicLoading, $ionicPopup, $ionicModal) {


 $scope.userInfo = {
    username: "",
    password: ""
  }; 


$scope.doSignUp= function() {
    $ionicLoading.show({
          template: 'Loading...'
          });
    var formData = new FormData();
        formData.append("username", $scope.userInfo.username);
        formData.append("password", $scope.userInfo.password);
        
    $http({
            method  : 'POST',
            url     : 'http://Molli.tv/api/sign_up',
            headers : { 'Content-Type': undefined },
            data    :  formData
           })
        .then(function mySucces(response) {
              $ionicLoading.hide();
              if(response.data.success != false){
                  localStorage.setItem("token", response.data.token);
                  console.log(response.data);
                  $state.go("app.my_account");

              }
              else{
                  $ionicPopup.alert({
                     title: 'Wrong username/password',
                     template: response.data.message
                   });
              }          
            }, function myError(response) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                     title: 'Connection Error',
                     template: 'Something is wrong with your connection. Try again later.'
                   });
          });
      };    


})





.controller('create_montage_controller', function($scope,$state, $ionicPopup,  $ionicLoading,$http) {
  $scope.videosAdded = [];
  $scope.thumbnail_image = {};
  $scope.button_stay_hidden = true;

  $scope.userInfo = {
    title: "",
  }; 
  /////triggers hidden html5 file input element.
  $scope.choose_vids = function(){
    ionic.trigger('click', { target: document.getElementById('molli_vids')});
    console.log("even fired");
  };  

  $scope.choose_image = function(){
    ionic.trigger('click', { target: document.getElementById('molli_thumbnail')});
    console.log("Molli image input fired");
  };  

  $scope.addVideo = function(element){

    $scope.$apply(function() {
      console.log(element);
      $scope.videosAdded.push(document.getElementById('molli_vids').files[0]);
      console.log($scope.videosAdded);
    });
  };

  $scope.addImage = function(element){
    $scope.$apply(function() {
      $scope.thumbnail_image = document.getElementById('molli_thumbnail').files[0];
      $scope.button_stay_hidden = false;
      console.log($scope.thumbnail_image);
    });
  };
 
   $scope.sendVideosToApi = function() {
        $ionicLoading.show({
          template: 'Uploading...This may take up to a few moments.'
          });
        var formData = new FormData();
        if(localStorage.getItem('token') != null){
          formData.append("token", localStorage.getItem('token') );
        };
        formData.append("thumbnail_image", $scope.thumbnail_image);        
        formData.append("title", $scope.userInfo.title);
        /////getting all videos from html form file input and appending them to data posted to API
        for(i=0;i< $scope.videosAdded.length;i++){
          formData.append("videos", $scope.videosAdded[i]);
          console.log("processesing file: " + $scope.videosAdded[i].name);
        };
        console.log("this is being called");
        $http({
            method  : 'POST',
            url     : 'http://Molli.tv/api/montage/new',
            headers : { 'Content-Type': undefined },
            data    :  formData
           })
        .then(function mySucces(response) {
              $ionicLoading.hide();
              console.log(response);
              $state.go('app.watch_montage', {montage_id:response.data.montage._id});
            }, function myError(response) {
              $ionicLoading.hide();
               $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
              console.log(response.statusText);
          });
    } 
})

.controller('my_account_controller', function($scope, $http, $state) {
    /////////this first function gathers the user's data before opening the view
    //////it also sends him to the login page if he is not authenticated
      $scope.$on("$ionicView.beforeEnter", function(event, data){
           $scope.accountLoad();
        });
      
      $scope.accountLoad = function(){
            if(localStorage.getItem("token") != null){
            var formData = new FormData();
            
            $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/account_details?token=' + localStorage.getItem("token"),
                  headers : { 'Content-Type': undefined },
                 })
              .then(function mySucces(response) {
                    $scope.user = response.data;
                    console.log(response.data);
                  }, function myError(response) {
                     $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
                    console.log(response.statusText);
                });    
            }
            else{
                    $state.go('app.login'); 
            }  
      };
      $scope.logout = function(){
        localStorage.removeItem("token", null);
        $state.go('app.home'); 
      };

      

})

.controller('redirect_next_montage_controller', function($scope, $ionicPopup, $stateParams, $state, $http, $ionicLoading, $cordovaSocialSharing) {
        $state.go('app.watch_montage', {"montage_id": $stateParams.montage_id});

})

.controller('terms_conditons_controller', function($scope, $ionicPopup, $stateParams, $state, $http, $ionicLoading, $cordovaSocialSharing) {

})


.controller('watch_montage_controller', function($scope, $rootScope,$ionicPopup, $stateParams, $state, $http, $ionicLoading, $cordovaSocialSharing) {
        $scope.next_montage = {};
        $scope.$on("$ionicView.enter", function(event, data){
            $ionicLoading.show({
              template: 'Loading...'
              });
           $scope.getMontageContent();
        });

        /*$rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams, options){ 
                // transitionTo() promise will be rejected with 
                // a 'transition prevented' error
                $ionicLoading.show({
                  template: 'Loading...'
                  });
                $scope.getMontageContent();
            });*/
/*
        $scope.$on("$ionicView.enter", function(event, data){
          $scope.beginMontagePlaylist();
        });*/

         $scope.$on("$ionicView.beforeLeave", function(event, data){
            $scope.leaveState();         
        });


        $scope.leaveState = function(){
          var videoPlayer= document.getElementById('video');
          videoPlayer.pause(); 
        };

        $scope.share_vid = function(montage_badge){
          $cordovaSocialSharing
            .share("Video On Molli",  "Molli.tv/watch/montage/" + montage_badge, "Molli.tv/watch/montage/" + montage_badge, "Molli.tv/watch/montage/" + montage_badge) // Share via native share sheet
            .then(function(result) {
               
            }, function(err) {
               $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
            });
        };

       $scope.getMontageContent = function(){
             $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/montage/watch/' + $stateParams.montage_id,
                  headers : { 'Content-Type': undefined },
                 })
                .then(function mySucces(response) {
                      $scope.montage_info = response.data.result;
                      $scope.video_array = response.data.result.videos;
                      $scope.caption = response.data.result.title;
                      /*$scope.nextVid = response.data.next_result._id;
                      console.log( $scope.nextVid);*/
                      $ionicLoading.hide();
                      var next_result = response.data.next_result;
                      var rand_int = Math.floor((Math.random() * next_result.length-1) + 0);
                      $scope.next_montage = next_result[rand_int]._id;
                      console.log("next montage is: #" +  rand_int);
                      $scope.beginMontagePlaylist();

                    }, function myError(response) {
                       $ionicLoading.hide();
                       $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
                       $state.go('app.home');
                      console.log(response.statusText);
                  });    
          };
      $scope.goToNext = function(){
        $state.go($state.current, {"montage_id": $scope.next_montage}, {reload: true , inherit: false, notify: true});
      };
      
      $scope.beginMontagePlaylist = function(){
        var videoPlayer= document.getElementById('video');
        videoPlayer.src="http://Molli.tv/videos/" + $scope.video_array[0].video;
        var i = 1;
        videoPlayer.addEventListener('ended', function(){
        if(i < $scope.video_array.length){
            this.pause();
            this.src = "http://Molli.tv/videos/" + $scope.video_array[i].video;
            i++;
          }
          else{
            this.src = "http://Molli.tv/videos/" + $scope.video_array[0].video;
            i = 1;
          }

            }, false);
      };
     
})

.controller('my_montages_controller', function($scope, $stateParams, $ionicLoading, $http, $sce) {

      $scope.$on("$ionicView.beforeEnter", function(event, data){
            $ionicLoading.show({
              template: 'Loading...'
              });
            $scope.getInitialContent();
            $scope.counter = 1;
            $scope.noMoreVideos = true;
        });



        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.loadMore = function() {
           $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/montage/my_montages/page/' + $scope.counter+'?token=' +localStorage.getItem('token'),
                  headers : { 'Content-Type': undefined },
                 })
              .then(function mySucces(response) {
                    if(response.data.results.length > 0){
                      $scope.montages.push(response.data.results);
                      console.log(response.data);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      $scope.counter++;
                    }
                    else{
                      $ionicLoading.hide();
                      $scope.noMoreVideos = false;
                    }
                    
                  }, function myError(response) {
                    console.log(response.statusText);
                     $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
          });
       };



      $scope.getInitialContent = function(){
        $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/montage/my_montages/page/' + $scope.counter+'?token=' +localStorage.getItem('token'),
                  headers : { 'Content-Type': undefined },
                 })
              .then(function mySucces(response) {
                    $ionicLoading.hide();
                    $scope.montages = response.data.results;
                    if($scope.montages.length < 1){
                      $scope.videos = true;
                    }
                    console.log(response.data);
                  }, function myError(response) {
                    console.log(response.statusText);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
                }); 
      };

})



.controller('home_controller', function($scope, $stateParams, $state, $ionicPopup, $ionicLoading, $http, $sce) {
      $scope.$on("$ionicView.beforeEnter", function(event, data){
            $ionicLoading.show({
              template: 'Loading...'
              });
            $scope.getRecentContent();
            $scope.noMoreVideos = false;
            $scope.counter = 1;
        });



        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.loadMore = function() {
           $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/montage/recent/page/' + $scope.counter,
                  headers : { 'Content-Type': undefined },
                 })
              .then(function mySucces(response) {
                    if(response.data.results.length > 0){
                      $scope.montages.push(response.data.results);
                      console.log(response.data);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      $scope.counter++;
                    }
                    else{
                      $scope.noMoreVideos = true;
                    }
                    
                  }, function myError(response) {
                      console.log(response.statusText);
                      $ionicLoading.hide();
                      $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
          });
       };



      $scope.getRecentContent = function(){
        $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/montage/recent',
                  headers : { 'Content-Type': undefined },
                 })
              .then(function mySucces(response) {
                    $ionicLoading.hide();
                    $scope.montages = response.data.results;
                    console.log(response.data);
                  }, function myError(response) {
                    console.log(response.statusText);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
                }); 
      };

})


.controller('popular_controller', function($scope, $stateParams, $state, $ionicPopup, $ionicLoading, $http, $sce) {
      $scope.$on("$ionicView.beforeEnter", function(event, data){
            $ionicLoading.show({
              template: 'Loading...'
              });
            $scope.getRecentContent();
            $scope.noMoreVideos = false;
            $scope.counter = 1;
        });



        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.loadMore = function() {
           $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/montage/popular/page/' + $scope.counter,
                  headers : { 'Content-Type': undefined },
                 })
              .then(function mySucces(response) {
                    if(response.data.results.length > 0){
                      $scope.montages.push(response.data.results);
                      console.log(response.data);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      $scope.counter++;
                    }
                    else{
                      $scope.noMoreVideos = true;
                    }
                    
                  }, function myError(response) {
                      console.log(response.statusText);
                      $ionicLoading.hide();
                      $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
          });
       };



      $scope.getRecentContent = function(){
        $http({
                  method  : 'GET',
                  url     : 'http://Molli.tv/api/montage/popular',
                  headers : { 'Content-Type': undefined },
                 })
              .then(function mySucces(response) {
                    $ionicLoading.hide();
                    $scope.montages = response.data.results;
                    console.log(response.data);
                  }, function myError(response) {
                    console.log(response.statusText);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                           title: 'Connection Error',
                           template: 'Something is wrong with your connection. Try again later.'
                         });
                }); 
      };

});


