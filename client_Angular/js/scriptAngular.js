var myApp = angular.module('myApp',[]);
  myApp.controller('MainController', ['$scope', '$http', function($scope, $http) { 
  console.log("test");
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
            alert("Echec de l'import des données");
        })
     };
  }]);
  
  
  