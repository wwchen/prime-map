angular.module('primeRestaurantsApp', [
  'ngRoute',
  'googleMaps',
  'restaurantDetails'
])

.config(function($routeProvider) {
  $routeProvider.
    when('/map', {
      templateUrl: 'partials/map.html',
      controller: 'MainCtrl'
    }).
    /*
    when('/restaurant/:id', {
      templateUrl: 'partials/detail.html',
      controller: 'DetailCtrl'
    }).
    */
    otherwise({
      redirectTo: '/map'
    });
});
