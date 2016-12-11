var myApp = angular.module('myApp',[]);
  myApp.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.GETobtenirRegions = function() {
      $http({
        method : 'GET',
        url : 'http://localhost:1337/obtenirRegions',

        headers: {
          'Content-Type': 'application/JSON'
        },
      }).then(
          function successCallback(response) {
          $scope.regions = response.data; // On stock le JSON obtenu par le WebService
          },
          function errorCallback(response) {
            alert("Echec de l'import des régions");
        })
     };

     $scope.GETobtenirDepartementsInRegion = function(region) {
      region = region.substring(0,1).toUpperCase()+region.substring(1);
       $http({
         method : 'GET',
         url : 'http://localhost:1337/obtenirDepartement',
         params: {region: region},

         headers: {
           'Content-Type': 'application/JSON'
         },
       }).then(
           function successCallback(response) {
           $scope.departementsInRegion = response.data; // On stock le JSON obtenu par le WebService
           },
           function errorCallback(response) {
             alert("Echec de l'import des départements");
         })
      };
  }]);
