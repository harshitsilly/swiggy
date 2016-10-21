


/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren */
'use strict';



/* eslint-disable quotes, comma-spacing */
var PrecacheConfig = [["/index.html","f3e482014a9d418bcb37183c0532c3d9"],["/manifest.json","d99e4705e1bd12923bd154ec62a562f6"],["/css/style.css","ec3d211e23f6f3de6a5ed71c19022df6"],["/lib/ionic/css/ionic.css","ec3d211e23f6f3de6a5ed71c19022df4"],["/lib/custom/tab/tabSlideBox.css","ec3d211e23f6f3de6a5ed71c19022df6"],["/lib/ionic/js/ionic.bundle.js","ec3d211e23f6f3de6a5ed71c19022da2"],["/lib/ionic-platform-web-client/dist/ionic.io.bundle.min.js","ec3d211e23f6f3de6a5ed71c19022da3"],["https://unpkg.com/angular-toastr/dist/angular-toastr.tpls.js","ec3d211e23f6f3de6a5ed71c19022da5"],["https://unpkg.com/angular-toastr/dist/angular-toastr.css","ec3d211e23f6f3de6a5ed71c190226a6"],["https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false","ec3d211e23f6f3de6a5ed71c19022da8"],["https://code.ionicframework.com/nightly/css/ionic.css","60e6fac3d3fca4749d7c89770666f299"],["/lib/ngAutocomplete.js","ec3d211e23f6f3de6a5ed71c19022da9"],["/lib/ngCordova/dist/ng-cordova.min.js","ec3d211e23f6f3de6a5ed71c19022da9"],["/partials/url-1","e01f3b2de9ec6b1417b623dd9da9593f"],["/templates/menu.html","cb4d288fe4e98581061a4fea82e64324"],["/lib/ionic-service-core/ionic-core.js","ec3d211e23f6f3de6a5ed71c19022db1"],["/lib/ionic-service-push/ionic-push.js","ec3d211e23f6f3de6a5ed71c19022db2"],["/lib/custom/tab/tabSlideBox.js","ec3d211e23f6f3de6a5ed71c19022db3"],["/lib/jquery/dist/jquery.js","ec3d211e23f6f3de6a5ed71c19022db4"],
["https://rawgit.com/angular/bower-material/v0.7.0-rc1/angular-material.min.css","ec3d211e23f6f3de6a5ed71c19022db5"],["https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-messages.js","ec3d211e23f6f3de6a5ed71c19022db6"],
["/js/app.js","ec3d211e23f6f3de6a5ed71c19022db7"],["/js/controllers.js","ec3d211e23f6f3de6a5ed71c19022db7"],["/js/services.js","ec3d211e23f6f3de6a5ed71c19022db8"],["/js/angular-reverse-geocode.js","ec3d211e23f6f3de6a5ed71c19022db9"],["","ec3d211e23f6f3de6a5ed71c19022dc1"],["https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js","94c84380a5b6cf782844f4d6081696f3"],["/templates/card.html","ec3d211e23f6f3de6a5ed71c19022dc4"],["/templates/newPass.html","ec3d211e23f6f3de6a5ed71c19022dc5"],["/templates/newPass1.html","ec3d211e23f6f3de6a5ed71c19022dc6"],["/templates/notification.html","ec3d211e23f6f3de6a5ed71c19022dc6"],["/templates/overview.html","ec3d211e23f6f3de6a5ed71c19022dc7"],["/templates/restaurant.html","ec3d211e23f6f3de6a5ed71c19022dc8"],["/templates/settings.html","ec3d211e23f6f3de6a5ed71c19022dc9"],["/templates/account.html","ec3d211e23f6f3de6a5ed71c19022dd1"]];
/* eslint-enable quotes, comma-spacing */
var CacheNamePrefix = 'sw-precache-v1-app-shell-' + (self.registration ? self.registration.scope : '') + '-';


var IgnoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var populateCurrentCacheNames = function (precacheConfig, cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl, ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  var now = Date.now();

  event.waitUntil(
    caches.keys().then(function(allCacheNames) {
      return Promise.all(
        Object.keys(CurrentCacheNamesToAbsoluteUrl).filter(function(cacheName) {
          return allCacheNames.indexOf(cacheName) === -1;
        }).map(function(cacheName) {
          var url = new URL(CurrentCacheNamesToAbsoluteUrl[cacheName]);
          // Put in a cache-busting parameter to ensure we're caching a fresh response.
          if (url.search) {
            url.search += '&';
          }
          url.search += 'sw-precache=' + now;
          var urlWithCacheBusting = url.toString();

          console.log('Adding URL "%s" to cache named "%s"', urlWithCacheBusting, cacheName);
          return caches.open(cacheName).then(function(cache) {
            var request = new Request(urlWithCacheBusting, {credentials: 'same-origin'});
            return fetch(request.clone()).then(function(response) {
              if (response.ok) {
                return cache.put(request, response);
              }

              console.error('Request for %s returned a response with status %d, so not attempting to cache it.',
                urlWithCacheBusting, response.status);
              // Get rid of the empty cache if we can't add a successful response to it.
              return caches.delete(cacheName);
            });
          });
        })
      ).then(function() {
        return Promise.all(
          allCacheNames.filter(function(cacheName) {
            return cacheName.indexOf(CacheNamePrefix) === 0 &&
                   !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            console.log('Deleting out-of-date cache "%s"', cacheName);
            return caches.delete(cacheName);
          })
        );
      });
    }).then(function() {
      if (typeof self.skipWaiting === 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim === 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command === 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    var urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url,
      IgnoreUrlParametersMatching);

    var cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    var directoryIndex = 'index.html';
    if (!cacheName && directoryIndex) {
      urlWithoutIgnoredParameters = addDirectoryIndex(urlWithoutIgnoredParameters, directoryIndex);
      cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    }

    var navigateFallback = '/app-shell';
    // Ideally, this would check for event.request.mode === 'navigate', but that is not widely
    // supported yet:
    // https://code.google.com/p/chromium/issues/detail?id=540967
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1209081
    if (!cacheName && navigateFallback && event.request.headers.has('accept') &&
        event.request.headers.get('accept').includes('text/html')) {
      var navigateFallbackUrl = new URL(navigateFallback, self.location);
      cacheName = AbsoluteUrlToCacheName[navigateFallbackUrl.toString()];
    }

    if (cacheName) {
      event.respondWith(
        // We can't call cache.match(event.request) since the entry in the cache will contain the
        // cache-busting parameter. Instead, rely on the fact that each cache should only have one
        // entry, and return that.
        caches.open(cacheName).then(function(cache) {
          return cache.keys().then(function(keys) {
            return cache.match(keys[0]).then(function(response) {
              return response || fetch(event.request).catch(function(e) {
                console.error('Fetch for "%s" failed: %O', urlWithoutIgnoredParameters, e);
              });
            });
          });
        }).catch(function(e) {
          console.error('Couldn\'t serve response for "%s" from cache: %O', urlWithoutIgnoredParameters, e);
          return fetch(event.request);
        })
      );
    }
  }
});

