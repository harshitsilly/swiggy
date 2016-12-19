// // angular.module('services', [])

// // .service('UserService', function() {

// // //for the purpose of this example I will store user data on ionic local storage but you should save it on a database

// //   var setUser = function(user_data) {
// //     window.localStorage.starter_facebook_user = JSON.stringify(user_data);
// //   };

// //   var getUser = function(){
// //     return JSON.parse(window.localStorage.starter_facebook_user || '{}');
// //   };

// //   return {
// //     getUser: getUser,
// //     setUser: setUser
// //   };
// // });


angular.module('services', [])



.service('LoginService', ['$q', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }

            return promise;
        },
        getLoginPattern: function() {
            return window.localStorage.getItem("login_pattern2");
        },
        setLoginPattern: function(pattern) {
            window.localStorage.setItem("login_pattern2", pattern);
        },
        checkLoginPattern: function(pattern) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            if (pattern == this.getLoginPattern()) {
                deferred.resolve();
            } else {
                deferred.reject();
            }

            return promise;
        }

    }
}])

 

 
.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
});