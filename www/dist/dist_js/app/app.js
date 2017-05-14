angular.module('bucketList', ['ionic','tabSlideBox','florian.directives','angularReverseGeocode','controllers','templates','services','ngAnimate','ionicLazyLoad'])


.run( ['$ionicPlatform', '$rootScope', '$window', '$ionicLoading', '$state', function($ionicPlatform,$rootScope, $window, $ionicLoading,$state) {
  
    

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
  
    $rootScope.baseuRL = location.origin;
  
     
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
                template : text ? text : 'Loading..',
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
        
    //      var io = Ionic.io();
    // var push = new Ionic.Push({
    //   "onNotification": function(notification) {
    //     alert('Received push notification!');
    //   },
    //   "pluginConfig": {
    //     "android": {
    //       "iconColor": "#0000FF"
    //     }
    //   }
    // });
    // var user1 = Ionic.User.current();
    
    // if (!user1.id) {
    //   user1.id = Ionic.User.anonymousId();
    // }
    
    // // Just add some dummy data..
    // user1.set('name', 'Simon');
    // user1.set('bio', 'This is my little bio');
    // user1.save();
   
    // var callback = function(data) {
    //   push.addTokenToUser(user1);
    //   user1.save();
    // };
    // push.register(callback);
    
        
        
    });
}])



  
   

  

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  
    $stateProvider
        
      
        .state('signup', {
            url: '/signup',
            templateUrl: 'auth-signup.html',
                    controller: 'SignUpCtrl'
            
            
        })
        
          .state('signin', {
            url: '/signin',
            templateUrl: 'auth-signin.html',
                    controller: 'SignInCtrl'
            
        })
        
        .state('menu', {
      url: '/menu',
      templateUrl: 'menu.html'
    })
      
    
    
  
   
        
    .state('menu.restaurant', {
      url: '/restaurant',
       views: {
        'side-menu21': {
          templateUrl: 'restaurant.html',
          
        }
      }
    })

     .state('menu.restaurant.overview', {
      url: '/overview',
      views: {
        'restaurantdetails': {
          templateUrl: 'overview.html',
          controller: 'overviewCtrl'
        }
      }
    })

    
    
     .state('menu.restaurant.card', {
      url: '/card',
      
      views: {
        'restaurantdetails': {
          templateUrl: 'card.html',
          controller: 'cardCtrl'
        }
      }
    })

     
    
      .state('menu.restaurant.notification', {
      url: '/notification',
        views: {
        'restaurantdetails': {
          templateUrl: 'notification.html',
          controller: 'notificationCtrl'
        }
      }
        
       
    })
          
    // .state('menu.account', {
    //   url: '/account',
    //   cache : false ,
    //   views: {
    //     'side-menu21': {
    //       templateUrl: 'templates/account.html',
    //       controller: 'accountCtrl'
    //     }
    //   }
    // })
        
   
    
      
    
      
        
    
        
    $urlRouterProvider.otherwise('/menu/restaurant/overview');
}])

.factory('mySocket', ['socketFactory', function (socketFactory) {
  var myIoSocket = io.connect('http://localhost:3001', {reconnect: true});

 var  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
}])

.filter('cuisineFilter', function() {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(input) {
    var output= "";
    if(input && input.length>0)
    {
    var alength = input.length;
    for(var i in input)
    {   
      output =   output + input;

    }
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
.directive('ionSearchBar', ['$timeout', function($timeout) {
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
}]);

