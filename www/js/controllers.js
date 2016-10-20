/* global $rootScope */

angular.module('controllers', [])
    .controller('SignInCtrl', [
        '$scope', '$rootScope','$http','$state',
        
        function($scope,  $rootScope,$http,$state) {
            // check session
           
$scope.sigin = function(){
var payload= {"mobile" : this.user.phone , 
	"password" : this.user.pwd
}	

$http({
  method: 'post',
  url: 'https://'+$rootScope.baseuRL+'/api/auth/signin',
 headers : {'Content-Type': 'application/json'} ,
         
  data: payload
}).then(function successCallback(response) {
   $state.go('menu.restaurant.overview')
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

}
            
  
        }])

.controller('SignUpCtrl', [
    '$scope', '$rootScope', '$firebaseAuth', '$window',
    function($scope, $rootScope, $firebaseAuth, $window, UserService, $ionicActionSheet, $state, $ionicLoading) {

        $scope.user = {
            email: "",
            password: ""
        };
        $scope.createUser = function() {
            var email = this.user.email;
            var password = this.user.password;
            if (!email || !password) {
                $rootScope.notify("Please enter valid credentials");
                return false;
            }
            $rootScope.show('Please wait.. Registering');
            var item7 = "";
            var item8 = "";

            $rootScope.auth.$createUser(email, password, function(error, user) {
                if (!error) {
                    $rootScope.hide();
                    $rootScope.userEmail = user.email;
                    $window.location.href = ('#/menu/overview');
                     var itemRef3 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        itemRef3.update({
            item7 : item7,
            item8 : item8
        }, function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully updated');
            }
        });
                    
                } else {
                    $rootScope.hide();
                    if (error.code == 'INVALID_EMAIL') {
                        $rootScope.notify('Invalid Email Address');
                    } else if (error.code == 'EMAIL_TAKEN') {
                        $rootScope.notify('Email Address already taken');
                    } else {
                        $rootScope.notify('Oops something went wrong. Please try again later');
                    }
                }
            });
        }
        
        
        // facebook
        // $scope.user = UserService.getUser();

	// $scope.showLogOutMenu = function() {
	// 	var hideSheet = $ionicActionSheet.show({
	// 		destructiveText: 'Logout',
	// 		titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
	// 		cancelText: 'Cancel',
	// 		cancel: function() {},
	// 		buttonClicked: function(index) {
	// 			return true;
	// 		},
	// 		destructiveButtonClicked: function(){
	// 			$ionicLoading.show({
	// 			  template: 'Logging out...'
	// 			});

    //     // Facebook logout
    //     facebookConnectPlugin.logout(function(){
    //       $ionicLoading.hide();
    //       $state.go('welcome');
    //     },
    //     function(fail){
    //       $ionicLoading.hide();
    //     });
	// 		}
	// 	});
	// };
    }
])

.controller('myListCtrl', function($rootScope, $scope, $window, $ionicModal, $firebase) {
    $rootScope.show("Please wait... Processing");
    $scope.list = [];
    var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef.on('value', function(snapshot) {
        var data = snapshot.val();
        $scope.list = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key].isCompleted == false) {
                    data[key].key = key;
                    $scope.list.push(data[key]);
                }
            }
        }

        if ($scope.list.length == 0) {
            $scope.noData = true;
        } else {
            $scope.noData = false;
        }
        $rootScope.hide();
    });


    $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
        $scope.newTemplate = modal;
    });

    $scope.newTask = function() {
        $scope.newTemplate.show();
    };

 $scope.markCompleted = function(key) {
        $rootScope.show("Please wait... Updating List");
        var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail) + '/' + key);
        itemRef.update({
            isCompleted: true
        }, function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully updated');
            }
        });
    };
   
    $scope.deleteItem = function(key) {
        $rootScope.show("Please wait... Deleting from List");
        var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        bucketListRef.child(key).remove(function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully deleted');
            }
        });
    };
})



.controller('mapCtrl', function($scope, $ionicPopup,$ionicPlatform, $rootScope,$ionicLoading,$cordovaGeolocation) {
 $ionicPlatform.ready(function(){
  $rootScope.positions = [{
    lat: 43.07493,
    lng: -89.381388
  }];

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });

  $scope.centerOnMe= function(){
  $rootScope.positions = [];
    
    
    $ionicLoading.show({
      template: 'Loading...'
    });

 
   
   
   
        
        
      var onSuccess=  function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $rootScope.positions.push({lat: pos.lat(),lng: pos.lng()});
      console.log(pos);
      $scope.map.setCenter(pos);
      
      
    
       
     
      };    
      
     var onError =  function onError(error) {
    $ionicPopup.alert({
     title: 'Turn on your gps',
     template: 'Could not locate your device'
   });
}
    navigator.geolocation.getCurrentPosition(onSuccess, onError,{maximumAge:8000,timeout:3000,enableHighAccuracy:true});
      
     
      $ionicLoading.hide();
      
     
  };
  });
})

.controller('newCtrl', function($rootScope, $scope, $window, $firebase) {
    $scope.currentDate = new Date();
$scope.minDate = new Date(2016, 6, 1);
$scope.maxDate = new Date(2035, 6, 31);

$scope.datePickerCallback = function (val) {
    if (!val) { 
        console.log('Date not selected');
    } else {
        console.log('Selected date is : ', val);
    }
};
    $scope.data = {
        item: ""
    };
    $scope.close = function() {
        $scope.modal.hide();
    };

    $scope.createNew = function() {
        
        var item1 = this.data.item1;
         var item2 = this.data.item2; 
         var item3= this.data.item3;
          var item4 = this.data.item4;
          var item5 =  $rootScope.positions[0].lat;
          var item6 =  $rootScope.positions[0].lng;
          var item7= "hello" ;
          var item8 = "hi";
          var item20 = this.data.item20;
        if (!item1&&!item2&&!item3&&!item4) return;
        $scope.modal.hide();
        $rootScope.show();

        $rootScope.show("Please wait... Creating new");

        var form = {
            item1: item1,
            item2: item2,
             item3: item3,
              item4: item4,
               item5: item5,
               item6: item6,
               item20: item20,
               
              
              
            isCompleted: false,
            created: Date.now(),
            updated: Date.now()
        };

        var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        $firebase(bucketListRef).$add(form);
        $rootScope.hide();

    };
})


.controller('overviewCtrl',  function($scope,$rootScope,$ionicModal,$location,$state,$http,$ionicPopup,$ionicLoading,$ionicPlatform,toastr,$timeout) {
 $ionicPlatform.ready(function() {
    
	 $ionicLoading.show({
      template: '<ion-spinner class="ionicspinner" icon="android"></ion-spinner>'
    });


     var onSuccess=  function(position) {
      $scope.lat = position.coords.latitude;
     $scope.lng = position.coords.longitude;
     
$http({
  method: 'get',
  url: 'https://'+$rootScope.baseuRL+'/api/restaurants/list?lat=' + $scope.lat +'&lng='+ $scope.lng +'&carousel=true',
 
}).then(function successCallback(response) {
  $ionicLoading.hide();
  setTimeout(function() {
      
  },1000);
  console.log(response);
  if(response.data.data.rest_list)
  {  $scope.closedrestaurants = response.data.data.rest_list[0].restaurants;
       $scope.carousels = response.data.data.carousel;
   console.log($scope.closedrestaurants);}
   else{
 
     toastr.info(response.data.data.black_zone_message, {
  closeButton: true
 
});
    
   }
//    $ionicLoading.hide();
  }, function errorCallback(response) {
       $ionicLoading.hide();
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });   

     };    
      
     var onError =  function (error) {
          $ionicLoading.hide();
    $ionicPopup.alert({
     title: 'Turn on your gps',
     template: 'Could not locate your  device'
   });
}

    navigator.geolocation.getCurrentPosition(onSuccess, onError,{maximumAge:60000,timeout:20000,enableHighAccuracy:true});
// $scope.lat = 12.9044624;
// $scope.lng = 77.66223830000001;


 $scope.restaurantsort = function(){
       $ionicModal.fromTemplateUrl('templates/newPass1.html', function(modal) {
        $scope.newTemplate = modal;
        $scope.newTemplate.show();
    });

    
  }

$scope.searchRD = function(){
    
    if($scope.searchString==="")
    {
 navigator.geolocation.getCurrentPosition(onSuccess, onError,{maximumAge:60000,timeout:20000,enableHighAccuracy:true});
    }
    else{
         $http({
  method: 'get',
  url: 'https://'+$rootScope.baseuRL+'/api/restaurants/search?str=' + $scope.searchString +'&lat=' + $scope.lat +'&lng='+ $scope.lng +'&page=',
 
}).then(function successCallback(response) {
  $ionicLoading.hide();
  setTimeout(function() {
      
  },1000);
  console.log(response);
  $timeout(function(){
  // Any code in here will automatically have an $scope.apply() run afterwards
 $scope.searchquery = response.data.data;
 
  // And it just works!
},100);
 
 
//  $scope.closedrestaurants = response.data.data.restaurants[2];
 
});
    }
   
}
$scope.dishclick = function(searchresult){
  
    $http({
  method: 'get',
  url: 'https://'+$rootScope.baseuRL+'/api/restaurants/search?str=' + searchresult +'&lat=' + $scope.lat +'&lng='+ $scope.lng +'&page=',
 
}).then(function successCallback(response) {
  $ionicLoading.hide();
  setTimeout(function() {
      
  },1000);
  console.log(response);
   $timeout(function(){
  // Any code in here will automatically have an $scope.apply() run afterwards
  $scope.searchquery = response.data.data;
 $scope.closedrestaurants = response.data.data.restaurants[0].restaurants;
 
 
  // And it just works!
},100);

});
   
   
}
$scope.Locationedit = function(){
    
    $state.go("menu.restaurant.notification")
}
$scope.restaurantclick = function(closedrestaurant){
    $rootScope.slug = closedrestaurant.slugs.restaurant;
    $state.go("menu.restaurant.card")
}


	$scope.sidemenu = function(link){
		$location.path(link);
	}
   
   
         
      
           
 
 })
 })



.controller('MyCtrl', function($scope, $ionicGesture, $window, $interval) {
  $scope.lastEventCalled = 'Try to Drag the content up, down, left or rigth';
  var element = angular.element(document.querySelector('#eventPlaceholder'));
  var events = [{
    event: 'dragup',
    text: 'You dragged me UP!'
  },{
    event: 'dragdown',
    text: 'You dragged me Down!'
  },{
    event: 'dragleft',
    text: 'You dragged me Left!'
  },{
    event: 'dragright',
    text: 'You dragged me Right!'
  }];
  
  angular.forEach(events, function(obj){
    $ionicGesture.on(obj.event, function (event) {
      $scope.$apply(function () {
        $scope.lastEventCalled = obj.text;
      });
    }, element);
  });
})

.controller('transactionCtrl', function($scope,$ionicModal,$ionicLoading,$ionicPopup,$rootScope, $cordovaCamera, $ionicPlatform, $firebase) {
    
      
         
         $ionicPlatform.ready(function() {
             
          $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
        $scope.newTemplate = modal;
    });
         
          $scope.transaction = function() {
           $scope.newTemplate.show();
         };
         
         
          
  $rootScope.positions = [];
    
    
    $ionicLoading.show({
      template: 'Loading...'
    });

     var onSuccess=  function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $rootScope.positions.push({lat: pos.lat(),lng: pos.lng()});
      console.log(pos);
      $scope.map.setCenter(pos);
      
      
    
       
     
      };    
      
     var onError =  function (error) {
    $ionicPopup.alert({
     title: 'Turn on your gps',
     template: 'Could not locate your 1 device'
   });
}
    navigator.geolocation.getCurrentPosition(onSuccess, onError,{maximumAge:6000,timeout:2000,enableHighAccuracy:true});

      $ionicLoading.hide();
    
        
         
         
         
      var bucketListRef7 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef7.on('value', function(snapshot) {
        $scope.list = [];
        var data = snapshot.val();
        console.log(data);
         console.log($rootScope.image);
         
           $rootScope.image = data.item17;
        });
    $scope.takePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
                
                $scope.choosePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $rootScope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                    
                    var item17 =  $rootScope.imgURI;
                    
                    
                      var itemRef4 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        itemRef4.update({
            item17 :  item17
            
        }, function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully updated');
            }
                }); 
                 }
                 
               
  });

})


.controller('accountCtrl', function($scope,$rootScope, $window, $state, $firebase,$ionicGesture, $interval,$ionicModal,$filter) { 
 
  $rootScope.search = function(){
   $rootScope.Card = this.g;
   
    console.log( $rootScope.Card);
    // $state.go('menu.account', null, {reload: true});
    
    
  }
  
  
  
  var m = {
   item20 : "Credit",
  item21 : "Debit",
   item22 :"Wallet"
};
 $scope.list1 = m;
   $scope.numLimit = 10;
    $scope.colors = ['#F44336','#9C27B0', '#673AB7','#3F51B5','#0097A7','#00796B','#689F38','#4CAF50','#FF5722','#FD4037','#455A64']
     $scope.swiper = {};
 
    $scope.onReadySwiper = function (swiper) {
 
        swiper.on('slideChangeStart', function () {
            console.log('slide start');
        });
         
        swiper.on('onSlideChangeEnd', function () {
            console.log('slide end');
        });     
    };
  
   $rootScope.show("Please wait... Processing");
    $scope.list = [];

    var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef.on('value', function(snapshot) {
        $scope.list = [];
        var data = snapshot.val();
  

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                
        
                
                if (data[key].item5== $rootScope.positions[0].lat ) {
                    data[key].key = key;
                    
                    $scope.list.push(data[key]);
                   
                }
            }
        }
        if ($scope.list.length == 0) {
            $scope.noData = true;
        } else {
            $scope.noData = false;
        }

        $rootScope.hide();
    });

    $scope.deleteItem = function(key) {
        $rootScope.show("Please wait... Deleting from List");
        var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        bucketListRef.child(key).remove(function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully deleted');
            }
        });
    };
    
    
    
   
          $ionicModal.fromTemplateUrl('templates/transaction.html', function(modal) {
        $scope.newTemplate = modal;
    });
         
          $scope.transaction = function() {
           $scope.newTemplate.show();
         };
         
         
         
          $scope.favourite = function(key) { 
            console.log(localStorage.star);
           if (localStorage.star == "true") {
             localStorage.star = "false";
             console.log("star");
           } else {
             localStorage.star = "true";
             console.log("star1");
           } 
            
            this.mySwitch =  localStorage.star;
            console.log( this.mySwitch);
        
          }
          
         this.mySwitch =  localStorage.star;
         
          console.log( this.mySwitch);
          
  // function showBanner(index) {
	// 			var oldElm = document.querySelector('.slider ion-slide.slider-slide.current');
	// 			var q = '.slider ion-slide.slider-slide[data-index="' + index + '"]';
	// 			var elm = document.querySelector(q);

  //       console.log("Show banner " + index);
        
	// 			// Remove class "current"
	// 			if (null !== oldElm) {
	// 				oldElm.classList.remove("current");
	// 			}

	// 			// Add class "current" to current slide
	// 			if (null !== elm) {
	// 				elm.classList.add("current");
	// 			}
	// 		}
  
  

	// 		$scope.activeSlide = 0;

	// 		setTimeout(function() {
	// 			showBanner($scope.activeSlide);
	// 		}, 100);

	// 		$scope.slideChanged = showBanner;
            
            
             $scope.lastEventCalled = "true";
  var element = angular.element(document.querySelector('#eventPlaceholder'));
  var events = [{
    event: 'dragup',
    text: 'true'
  },{
    event: 'dragdown',
    text: 'You dragged me Down!'
  },{
    event: 'dragleft',
    text: 'You dragged me Left!'
  },{
    event: 'dragright',
    text: 'You dragged me Right!'
  }];
  
  angular.forEach(events, function(obj){
    $ionicGesture.on(obj.event, function (event) {
      $scope.$apply(function () {
        $scope.lastEventCalled = obj.text;
      });
    }, element);
    
  });
  
   $scope.noData3 = function() {
         

        if ($scope.lastEventCalled=="true") {
            $scope.noData3 = true;
             console.log("yes");
        } else {
            $scope.noData3 = false;
            console.log("no");
        }
       return $scope.noData3;
    };

       $scope.noData3();
    
       
      
      
 
})

.controller('AppCtrl', function($scope,$location, $window) {
	$scope.sidemenu = function(link){
		$location.path(link);
	}
   
    
})


.controller('testCtrl', function($scope,$rootScope, $cordovaCamera, $ionicPlatform, $firebase) {
 
 
  $ionicPlatform.ready(function() {
      var bucketListRef7 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef7.on('value', function(snapshot) {
        $scope.list = [];
        var data = snapshot.val();
        console.log(data);
         console.log($rootScope.image);
         
           $rootScope.image = data.item17;
        });
    $scope.takePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
                
                $scope.choosePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $rootScope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                    
                    var item17 =  $rootScope.imgURI;
                    
                    
                      var itemRef4 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        itemRef4.update({
            item17 :  item17
            
        }, function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully updated');
            }
                }); 
                 }
                 
               
  });
 
 
  

  var bucketListRef6 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef6.on('value', function(snapshot) {
        $scope.list = [];
        var data = snapshot.val();
        console.log(data);
         console.log($rootScope.image);
          $rootScope.name = data.item14;
          $rootScope.Phonenumber = data.item15;
          $rootScope.Email = data.item16;
           
        });
      
       
                
        
    
     $scope.edit = function(){var item14 =  this.name ;
    var item15 = this.Phonenumber;
    var item16 = this.Email;
    
       $rootScope.show("Please wait... Updating List");
        var itemRef4 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        itemRef4.update({
            item14 : item14,
             item15 : item15, 
             item16 : item16
        }, function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully updated');
            }
        });
    }

})
.controller('IntroCtrl', function($scope, $rootScope) {
  $scope.slides = {
    currentSlide: 0
  };
  $scope.title = '<i class="icon ion-android-home"></i>';

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    if (index == 2)
      $rootScope.$storage.seenIntro = true;
  };
})

.controller('patternCtrl', function($scope, LoginService, $ionicPopup, $state) {
    // 1
    $scope.log_pattern = LoginService.getLoginPattern();

    // 2
    var lock = new PatternLock("#lockPattern", {
        // 3
        onDraw:function(pattern){
            // 4
            if ($scope.log_pattern) {
                
                
          LoginService.checkLoginPattern(pattern).success(function(data) {
                    lock.reset();
                     
                    
                    
                }).error(function(data) {
                    lock.error();
                   
                $rootScope.show("Invalid Pattern");
           
                    
                });
                       
                
            } else {
                // 6
                LoginService.setLoginPattern(pattern);
                lock.reset();
                $scope.$apply(function() {
                    $scope.log_pattern = LoginService.getLoginPattern();    
                });
               $rootScope.show("Succesfully Created");
                $state.go('menu.settings');
            }
           
        }
    });
    
    
       var lock1 = new PatternLock("#lockPattern1", {  
        // 3
        onDraw:function(pattern){
            // 4
            if (LoginService.checkLoginPattern(pattern)) {
                 LoginService.setLoginPattern(pattern);
                lock1.reset();
                $scope.$apply(function() {
                    $scope.log_pattern = LoginService.getLoginPattern();    
                });
                 $state.go('menu.settings');
            }
        }
    });
    
    
     

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('tab.dash');
        }).error(function(data) {
          $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})







.controller('alwaysCtrl',  function($scope, $rootScope, $ionicUser, $ionicPush) { 
    $scope.identifyUser = function() {
	var user = $ionicUser.get();
	if(!user.user_id) {
		// Set your user_id here, or generate a random one.
		user.user_id = $ionicUser.generateGUID();
	};
 
	// Metadata
	
 
	// Identify your user with the Ionic User Service
	$ionicUser.identify(user).then(function(){
		$scope.identified = true;
		console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
	});
};

$scope.pushRegister = function() {
 console.log('Ionic Push: Registering user');
 
 // Register with the Ionic Push service.  All parameters are optional.
 $ionicPush.register({
   canShowAlert: true, //Can pushes show an alert on your screen?
   canSetBadge: true, //Can pushes update app icon badges?
   canPlaySound: true, //Can notifications play a sound?
   canRunActionsOnWake: true, //Can run actions outside the app,
   onNotification: function(notification) {
     // Handle new push notifications here
     return true;
   }
 });
};
        

})
.controller('MainCtrl', function($scope) {
    $scope.confirmed = '1';
 
  $scope.selectChange = function() {
    switch($scope.confirmed) {
      case '1': $scope.selected = '1';break;
  
      case '2': $scope.selected = '2';break;
    }
  }
  $scope.selectChange();
  
})

.controller('newPassCtrl',  function($rootScope, $scope, $window, $ionicModal, $firebase) {
    
    
     $scope.data = {
        item7: ""
    };
     $scope.noData = function() {
         var bucketListRef2 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef2.on('value', function(snapshot) {
       
        var data = snapshot.val();
         console.log(data);
       
        $rootScope.item11= data.item7 ;

        if (!data.item7=="") {
            $scope.noData3 = true;
             console.log("yes");
        } else {
            $scope.noData3 = false;
            console.log("no");
        }
       
    });
return !$scope.noData3;
       
    };

    $scope.close = function() {
        $scope.modal.hide();
    };
     $scope.createNew = function(key) {
          var item7 = this.data.item7;
          var item9 = this.data.item9;
          console.log(item7);
          console.log(item9);
          console.log($rootScope.item11);
          
          if(!item9=="" && $rootScope.item11=== item7)
          { 
               item7 = item9;}
               
               else{
                    $scope.modal.hide();
                  $rootScope.notify('Invalid Pin. Try it again.');
                  
                  
                  return ;
                   
                   
               }
         $scope.modal.hide();
        $rootScope.show("Please wait... Updating List");
        var itemRef2 = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
        itemRef2.update({
            item7 : item7
        }, function(error) {
            if (error) {
                $rootScope.hide();
                $rootScope.notify('Oops! something went wrong. Try again later');
            } else {
                $rootScope.hide();
                $rootScope.notify('Successfully updated');
            }
        });
    };
    
    
    
    
})

.controller('newPass1Ctrl', function($rootScope, $scope, $window, $ionicModal, $firebase) {
    
    
    $scope.sfclose = function() {
        $scope.modal.hide();
    };
    
})   
.controller('settingsCtrl', function($scope,$window, $ionicPopup, $rootScope,$ionicLoading,$ionicModal, $cordovaGeolocation) {
    
  
}) 


.controller('feedbackCtrl', function($scope) {
     $scope.numberSelection = 5;
    //  $scope.slider = 10* $scope.numberSelection;
     

})

.controller('scanCtrl', function($scope) {
    
    //  $scope.slider = 10* $scope.numberSelection;
      $scope.modalClasses = ['slide-in-up', 'slide-in-down', 'fade-in-scale', 'fade-in-right', 'fade-in-left', 'newspaper', 'jelly', 'road-runner', 'splat', 'spin', 'swoosh', 'fold-unfold'];


})

.controller('notificationCtrl', function($scope,$state) {
  $scope.locationback = function(){$state.go("menu.overview");
  }
})

.controller('cardCtrl', function($scope,$rootScope,$http,$ionicSlideBoxDelegate,$ionicModal,$ionicLoading,$ionicPlatform) {
$ionicPlatform.ready(function() {
     $ionicLoading.show({
      template: '<ion-spinner class="ionicspinner" icon="android"></ion-spinner>'
    });
 $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
 
  $scope.cartItemobject = {};
  var cardItemsPayload = function(fooditem){
      if( !fooditem.id)
      {  fooditem.id =  fooditem.menu_item_id}
         var foodItemedit =    {
           "menu_item_id" : fooditem.id,
           "quantity" : fooditem.quantity,
           "variants" : [],
           "addons" : []
        
       }
  $scope.cartItemobject[fooditem.id] = foodItemedit;
$scope.cartItemarray = $.map($scope.cartItemobject, function(value, index) {
    return [value];
});


return $scope.cartItemarray;
  
   }
   $scope.cartUpdate = function(fooditem){
       console.log(fooditem);
      var cardItems = cardItemsPayload(fooditem);
       var cart = {"cart" : 
       {"restaurantId" : $scope.restaurant.id,
       "cartItems" : cardItems,
       "curDelLoc" : {"lat":12.9044624,"lng":77.66223830000001,"address":"Haralur Rd, Bengaluru, Karnataka, India","id":"","deliveryLocation":"Eastwood Township, Harlur"}
           
       }}

       $http({
  method: 'post',
  url: 'https://'+$rootScope.baseuRL+'/api/cart/update',
 headers : {'Content-Type': 'application/json'} ,
         
  data: cart
}).then(function successCallback(response) {
   console.log(response);
   $scope.checkout = response.data.data;
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });



   };





   
  $ionicSlideBoxDelegate.update();
				// $scope.onSlideMove = function(data){
				// 	alert("You have selected " + data.index + " tab");
				// };
    var slug = $rootScope.slug
   $http({
  method: 'get',
  url: 'https://'+$rootScope.baseuRL+'/api/restaurants/menu?slug=' + slug,
 
}).then(function successCallback(response) {
  console.log(response);
   $scope.restaurant = response.data.data;
  $scope.foodmenu = response.data.data.categories;
   console.log($scope.foodmenu);
   $ionicLoading.hide();
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  $scope.finalcart = function(){
       $ionicModal.fromTemplateUrl('templates/newPass.html', function(modal) {
        $scope.newTemplate = modal;
        $scope.newTemplate.show();
    },
     {
      scope: $scope,
      animation: 'slide-in-up'
    });

       
   
  }

   $scope.Finalcheckout = function(){
       
       var payload=  {
           "order":{
            "payment_cod_method":"Mobikwik",
            "address_id":"1237634",
            "order_comments":"",
            "csrf_token":"34462345-f3d0-4810-b178-10cb26994c01a5bc62c7-8640-4262-a4f9-d92406e10fc4"}
       }
console.log(payload);
      $http({
  method: 'post',
  url: 'https://'+$rootScope.baseuRL+'/api/order/place',
 headers : {'Content-Type': 'application/json;charset=UTF-8',
} ,
     
  data: payload
}).then(function successCallback(response) {
   console.log(response);
   
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

   }
});
    
})

 .controller('bluetoothCtrl',function ($ionicPopup,$ionicModal,$rootScope,$ionicPlatform,$scope,$timeout) {
  
     $ionicPlatform.ready(function() {
  $scope.checkBT = (function () {
    ble.isEnabled(
         function() {
             $ionicPopup.alert({
     title: 'Your sync starts.',
     template: ' When sync done notification will appear.'
   });
         
      },
      function() {
           $ionicPopup.show({
     title: 'Turn on bluetooth',
    
     template: 'Bluetooth is not enabled. Click on settings to turn on and to start sync.',
   
    
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Settings</b>',
        type: 'button-positive',
        onTap: function() {
        ble.showBluetoothSettings();
          
        }
      }
    ]
     
     
    
     
   });
       
      }
        
        
        );
        
        
  });
  
  
  
//  $ionicPopup.alert({
//      title: '<b>Scan Devices</b>',
    
    
//      template:   '<b class="scan">Select The OneCard</b> </br>'+'<button  class=" button-block item item-divider" ng-mousedown="goMyLocation()">Current Location</button>'+
// '<button class="  button-block item item-divider" ng-mousedown="goMyLocation()">Current Location</button>'+
// '<button class=" button-block item item-divider" ng-mousedown="goMyLocation()">Current Location</button>'

   
    
    
   
     
//    });
    



  
  
  $scope.connectBT= (function () {
ble.startScan([], function(device) {
    console.log(JSON.stringify(device));
    console.log(device);
    $scope.scandevices = device.name;
     $ionicPopup.show({
     title: 'Scan Devices',
    
     template: 'Select The OneCard </br> ' +'<button ng-repeat="class in scandevices" class="button-clear item  button-full button-dark" ng-click="connectBT1()">{{ class }}</button>',
   
    
    scope: $scope,
    buttons: [
      { text:  $scope.scandevices,
      type: 'button-positive',
      onTap: function() {
           
         console.log("hello");
         $scope.connectBT1();
         $scope.connectBT2();
          
        }
        }]
    
     
   });
    
}, function() {
  console.log("Error");
});

setTimeout(ble.stopScan,
    5000,
    function() { console.log("Scan complete"); },
    function() { console.log("stopScan failed"); }
);


  

  });
  
 
     
    

 
     
  
  
   $scope.connectBT1= (function () {
  ble.connect('D0:39:72:B7:80:4C', function() {
  console.log("Connected");
  
}, function() {
  console.log("Error in connecting");
  
});


  
   });
   
 
   $(function() {
  $scope.box = $('.box');
  var button = $('.box button');
  button.on('click', function(){
    $scope.box.toggleClass('active');
    if( $scope.box.hasClass('active'))
      console.log("yup");
    else
     ble.disconnect('D0:39:72:B7:80:4C', function() {
  console.log("Disconnected");
  
}, function() {
  console.log("Cannot disconnect");
  
});
 
   
  });
});
  
 
   
    $scope.connectBT2= (function () {
  
$scope.list = [];

    var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef.on('value', function(snapshot) {
        $scope.list = [];
        var data = snapshot.val();
  

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                
        
                
                if (data[key].item5== $rootScope.positions[0].lat ) {
                    data[key].key = key;
                    $scope.list.push(data[key]);
                }
            }
        }
        if ($scope.list.length == 0) {
            $scope.noData = true;
        } else {
            $scope.noData = false;
        }

        $rootScope.hide();
    });

    console.log($scope.list);
     console.log($scope.list[0]);
     for (var x = 0; x < $scope.list.length; x++) {
    
       var y = 0;
       
     var s = [];
     s[y] =  $scope.list[x];
    
   console.log(s[y].item56);
    var someString = s[y].item56;
	var j;
  var i = 0;
 var data = new Uint8Array(someString.length);
   for(j = 0; j < someString.length; j++) {
	
   data[i] = someString.charCodeAt(j);

   i++
	}
  ble.write('D0:39:72:B7:80:4C', "FFF0", "FFF2", data.buffer,  function() {
  console.log("Success data");
  
}, function() {
  console.log("Error data");
  
}); 
setTimeout(function(){
  //your code to be executed after 1 seconds
}, 500); 
  y++
  console.log(data);
  }

ble.disconnect('D0:39:72:B7:80:4C', function() {
  console.log("Disconnected");
  
}, function() {
  console.log("Cannot disconnect");
  
});
 setTimeout(function(){
  //your code to be executed after 1 seconds
}, 2000); 

 $scope.box.toggleClass('active');
$ionicPopup.alert({
    
     template: 'Sync done. Your OneCard is ready'
   });
 
   var d = new Date()
console.log(d.toLocaleString());
var f = d.toString();
console.log(d.toString());
console.log(d);
$scope.e = "";
$scope.g = "";
for (var index = 0; index <10; index++) {
   $scope.e += f.charAt(index);
  
  
}
for (var index = 16; index <21; index++) {
  $scope.g += f.charAt(index);
  
  }
console.log($scope.e);
console.log($scope.g);
localStorage.e = $scope.e;

localStorage.g = $scope.g;
 $scope.m = localStorage.e ;
 $scope.n = localStorage.g ;


 });
 $scope.m = localStorage.e ;
 $scope.n = localStorage.g ;
 
 
  $scope.connectBT3= (function () {
  
ble.read('D0:39:72:B7:80:4C', "FFF0", "FFF1", function(response) {
  console.log("Success read data");
  console.log(response);
  
  
  
}, function() {
  console.log("Error read data");
  
});

 });
});
 })


.controller('scanCtrl', function($rootScope, $scope, $window) {
   
});






function escapeEmailAddress(email) {
    if (!email) return false
    // Replace '.' (not allowed in a Firebase key) with ','
    email = email.toLowerCase();
    email = email.replace(/\./g, ',');
    return email.trim();
}
