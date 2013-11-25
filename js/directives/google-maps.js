"use strict";

angular.module('googleMaps', [])

.directive('googleMaps', function() {
  return {
    restrict: 'E', // only match element name
    replace: true,
    transclude: true,
    template: '<div style="width: 100%; height: 100%" ng-transclude></div>',
    scope: {
      center: '=',
      zoom: '='
    },
    controller: function ($scope, $element, $attrs) {
      this.getMap = function() {
        return $scope.map;
      };
    },
    link: function ($scope, $element, $attrs) {

      var DEFAULT_OPTS = {
        center: new google.maps.LatLng(0, 0),
        zoom: 10
      }

      // check for mandatory parameters
      if(!angular.isDefined($scope.center) || 
         !angular.isDefined($scope.zoom)) {
        console.error("Mandatory attributes not configured for initializing a Google Maps canvas");
        return;
      }

      var map = new google.maps.Map($element[0], DEFAULT_OPTS);
      $scope.map = map;

      $scope.$watch('center', function(center) {
        if(!center || !center.lat || !center.lng) { return; }
        map.setCenter(new google.maps.LatLng(center.lat, center.lng));
        console.log('new center set');
      });

      $scope.$watch('zoom', function(zoom) {
        if(!zoom || !parseInt(zoom)) { return; }
        map.setZoom(parseInt(zoom));
        console.log('new zoom set');
      });

      google.maps.event.addListener(map, 'dragend', function() {
        console.log('fire!');
      });
      google.maps.event.addListener(map, 'zoom_changed', function() {
        console.log('fire!');
      });
      // destructor
      $element.on('$destroy', function() {
        console.log("canvas destroyed");
      });

      $element.on('focusout', function() {
        console.log('scroll');
      });

      $element.on('mousedown', function(e) {
        console.log('mousedown');
      });

      console.log("canvas created");
    }
  };
})

.directive('markers', function () {
  return {
    restrict: 'E',
    require: '^googleMaps',
    scope: {
      model: '=',
      lat: '@',
      lng: '@',
      click: '@'
    },
    link: function ($scope, $element, $attrs, $ctrl) {
      $scope.markers = $scope.markers || [];
      $scope.$watch('model', function (objs) {
        if(!objs) { return; }
        // delete all existing markers
        angular.forEach($scope.markers, function (m) {
          m.setMap(null);
        });
        // loop through all the objects
        angular.forEach(objs, function (obj) {
          var m = new google.maps.Marker({
            position: new google.maps.LatLng(obj[$scope.lat], obj[$scope.lng]),
            map: $ctrl.getMap() // parent directive
          });
          google.maps.event.addListener(m, 'click', function() {
            obj[$scope.click]();
          });
          $scope.markers.push(m);
        });
      });
    }
  }
})

.directive('marker', function () {
  return {
    restrict: 'E',
    require: '^googleMaps',
    scope: {
      coord: '=',
    },
    link: function ($scope, $element, $attrs, $ctrl) {
      $scope.markers = $scope.markers || [];
      $scope.$watch('coord', function (coords) {
        angular.forEach($scope.markers, function (m) {
          m.setMap(null);
        });
        $scope.markers.push(new google.maps.Marker({
          position: new google.maps.LatLng($scope.coord.lat, $scope.coord.lng),
          map: $ctrl.getMap()
        }));
      });
    }
  }
});