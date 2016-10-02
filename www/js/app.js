angular.module('bucketList', ['ionic','tabSlideBox','florian.directives','ionic.service.core','ksSwiper','ngCordova.plugins.cardIO','ngMap','ng-mfb','ionic.service.analytics','ngCordova','ionic-datepicker','ionic.service.push','angularReverseGeocode','ngMessages','firebase', 'ngStorage',
'btford.socket-io','controllers','services','ngAnimate','toastr','ngAutocomplete'])


.run( function($ionicPlatform,$rootScope,$ionicAnalytics, $firebaseAuth, $firebase, $window, $ionicLoading,$state,$localStorage) {
  
    

    $ionicPlatform.ready(function() {
      
        // $rootScope.checkSession = function() {
        //     var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
        //         if (error) {
        //             // no action yet.. redirect to default route
        //             $rootScope.userEmail = null;
                  
        //              $state.go('signin');
        //         } else if (user) {
                   
        //             // user authenticated with Firebase
        //             $rootScope.userEmail = user.email;
                   
        //              $state.go('menu.overview');
        //         } else {
        //             // user is logged out
        //             $rootScope.userEmail = null;
                   
        //              $state.go('signin');
        //         }
        //     });
        // }
      
    //  $rootScope.$storage = $localStorage.$default({
    //   seenIntro: false
    // });
    // console.log($rootScope.$storage.seenIntro);

    // if ($rootScope.$storage.seenIntro== false) {
      
     
    //   $state.go('signin');
    // } 
  
  
  
      $ionicAnalytics.register();
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

  
 
        // $rootScope.userEmail = null;
        // $rootScope.baseUrl = 'https://onecard2.firebaseio.com/';
        // var authRef = new Firebase($rootScope.baseUrl);
        // $rootScope.auth = $firebaseAuth(authRef);
        

        $rootScope.show = function(text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading..',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        $rootScope.hide = function() {
            $ionicLoading.hide();
        };

        $rootScope.notify = function(text) {
            $rootScope.show(text);
            $window.setTimeout(function() {
                $rootScope.hide();
            }, 1999);
        };

        $rootScope.logout = function() {
            $rootScope.auth.$logout();
            $rootScope.checkSession();
             $window.location.href = ('#/signin');
    
        };

      
        
        
//  push  notifcation
        
         var io = Ionic.io();
    var push = new Ionic.Push({
      "onNotification": function(notification) {
        alert('Received push notification!');
      },
      "pluginConfig": {
        "android": {
          "iconColor": "#0000FF"
        }
      }
    });
    var user1 = Ionic.User.current();
    
    if (!user1.id) {
      user1.id = Ionic.User.anonymousId();
    }
    
    // Just add some dummy data..
    user1.set('name', 'Simon');
    user1.set('bio', 'This is my little bio');
    user1.save();
   
    var callback = function(data) {
      push.addTokenToUser(user1);
      user1.save();
    };
    push.register(callback);
    
        
        
    });
})



  
   

  

.config(function($stateProvider, $urlRouterProvider,toastrConfig) {

   angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,    
    newestOnTop: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body'
  });
    $stateProvider
        
      
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/auth-signup.html',
                    controller: 'SignUpCtrl'
            
            
        })
        
          .state('signin', {
            url: '/signin',
            templateUrl: 'templates/auth-signin.html',
                    controller: 'SignInCtrl'
            
        })
        
        .state('menu', {
      url: '/menu',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })
      
    
    .state('intro', {
    url: '/a',
    templateUrl: "templates/intro.html",
    controller: 'IntroCtrl'
  })
  
  
   .state('menu.test', {
    url: '/test',
     views: {
        'side-menu21': {
          templateUrl: 'templates/test.html',
          controller: 'testCtrl'
        }
      }
  
  })
  
   .state('menu.form', {
    url: '/form',
     views: {
        'side-menu21': {
        templateUrl: "templates/intro.html",
    controller: 'IntroCtrl'
        }
      }
    
  })
      
      
      .state('pattern', {
    url: '/pattern',
    templateUrl: "templates/pattern.html",
    controller: 'patternCtrl'
  })
      
        
    .state('menu.restaurant', {
      url: '/restaurant',
      abstract : true,
       views: {
        'side-menu21': {
          templateUrl: 'templates/restaurant.html',
          
        }
      }
    })

     .state('menu.restaurant.overview', {
      url: '/overview',
      views: {
        'restaurantdetails': {
          templateUrl: 'templates/overview.html',
          controller: 'overviewCtrl'
        }
      }
    })

    
    
     .state('menu.restaurant.card', {
      url: '/card',
      
      views: {
        'restaurantdetails': {
          templateUrl: 'templates/card.html',
          controller: 'cardCtrl'
        }
      }
    })

     .state('menu.restaurant.checkout', {
      url: '/scan',
      
      views: {
        'restaurantdetails': {
          templateUrl: 'templates/scan.html',
          controller: 'scanCtrl'
        }
      }
    })
    
      .state('menu.restaurant.notification', {
      url: '/notification',
        views: {
        'restaurantdetails': {
          templateUrl: 'templates/notification.html',
          controller: 'notificationCtrl'
        }
      }
        
       
    })
          
    .state('menu.account', {
      url: '/account',
      cache : false ,
      views: {
        'side-menu21': {
          templateUrl: 'templates/account.html',
          controller: 'accountCtrl'
        }
      }
    })
        
      
   .state('menu.map', {
      url: '/map',
      views: {
        'side-menu21': {
          templateUrl: 'templates/map.html',
          controller: 'mapCtrl'
        }
      }
    })
      
        
    .state('menu.settings', {
      url: '/settings',
      views: {
        'side-menu21': {
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl'
        }
      }
    })
    
    .state('menu.bluetooth', {
      url: '/bluetooth',
      views: {
        'side-menu21': {
          templateUrl: 'templates/bluetooth.html',
          controller: 'bluetoothCtrl'
        }
      }
    })
        
      
    
      
        
    .state('menu.feedback', {
      url: '/feedback',
      views: {
        'side-menu21': {
          templateUrl: 'templates/feedback.html',
          controller: 'feedbackCtrl'
        }
      }
    })
    
         
  
        
      
        .state('menu.bucket', {
            url: "/bucket",
            abstract: true,
            views: {
        'side-menu21': {
          templateUrl: "templates/bucket.html"
        }
      }
           
        })
        
        
        
        
        .state('menu.bucket.list', {
            url: '/list',
            views: {
                'bucket-list': {
                    templateUrl: 'templates/bucket-list.html',
                    controller: 'myListCtrl'
                }
            }
        })
        .state('menu.bucket.completed', {
            url: '/completed',
            views: {
                'bucket-completed': {
                    templateUrl: 'templates/bucket-completed.html',
                    controller: 'completedCtrl'
                }
            }
        })
        
         .state('menu.bucket.notification', {
            url: '/notification',
            views: {
                'bucket-completed': {
                    templateUrl: 'templates/notification.html',
                    controller: 'notificationCtrl'
                }
            }
        })
        
    $urlRouterProvider.otherwise('/signin');
})

.factory('mySocket', function (socketFactory) {
  var myIoSocket = io.connect('http://localhost:3001', {reconnect: true});

 var  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
})

.filter('cuisineFilter', function() {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input) {
    var alength = input.length;
    var output= "";
    for(var i in input)
    {   
      output =   output + input;

    }
    

    // Do filter work here

    return output;

  }

})
.directive('helloWorld', function() {
  return {
    restrict: 'AE',
    replace: true,
    template: '<p style="background-color:{{color}}">Hello World',
    link: function(scope, elem, attrs) {
      elem.bind('click', function() {
        elem.css('background-color', 'white');
        
          scope.color = "white";
        
      });
      elem.bind('mouseover', function() {
        elem.css('cursor', 'pointer');
      });
    }
  };
});

angular.module('florian.directives', [])
// Create a `ion-search-bar` directive
.directive('ionSearchBar', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    scope: { search: '=?filter' },
    link: function(scope, element, attrs) {
      scope.placeholder = attrs.placeholder || '';
      scope.search = {value: '', focus: false};
      if (attrs.class) {
        element.addClass(attrs.class);
      }

      // We need the actual input field to detect focus and blur
      var inputElement = element.find('input')[0];

      // This function is triggered when the user presses the `Cancel` button
      scope.cancelSearch = function() {
        // Manually trigger blur
        inputElement.blur();
        scope.search.value = '';
      };

      // When the user focuses the search bar
      angular.element(inputElement).bind('focus', function () {
        // We store the focus status in the model to show/hide the Cancel button
        scope.search.focus = 1;
        // Add a class to indicate focus to the search bar and the content area
        element.addClass('search-bar-focused');
        angular.element(document.querySelector('.has-search-bar')).addClass('search-bar-focused');
        // We need to call `$digest()` because we manually changed the model
        scope.$digest();
      });
      // When the user leaves the search bar
      angular.element(inputElement).bind('blur', function() {
        scope.search.focus = 0;
        element.removeClass('search-bar-focused');
        angular.element(document.querySelector('.has-search-bar')).removeClass('search-bar-focused');
      });
    },
    template: '<div class="search-bar bar bar-header item-input-inset">' +
                '<label class="item-input-wrapper">' +
                  '<i class="icon ion-ios-search placeholder-icon"></i>' +
                  '<input type="search" placeholder="" ng-model="search.value">' +
                '</label>' +
                '<button class="button button-clear button-positive" ng-show="search.focus" ng-click="cancelSearch()">' +
                  'Cancel' +
                '</button>' +
              '</div>'
  };
});
