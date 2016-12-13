var myApp = angular.module('myApp',[]);

  myApp.controller('MainController', ['$scope', '$http',  function($scope, $http) {
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
           $scope.lat = 43.5576;
           $scope.lng = 5.3595;
           $scope.img = "http://commons.wikimedia.org/wiki/Special:FilePath/%C3%89guilles%20-%20Colline%20de%20Pierredon.jpg?width=200";

           },
           function errorCallback(response) {
             alert("Echec de l'import des départements");
         })
      };


      $scope.GETobtenirCoordonneesGPSDuMonument = function(departement) {
       //region = region.substring(0,1).toUpperCase()+region.substring(1);
        $http({
          method : 'GET',
          url : 'http://localhost:1337/obtenirCoordonneesGPSMonumentsDansDepartement',
          params: {departement: departement},

          headers: {
            'Content-Type': 'application/JSON'
          },
        }).then(
            function successCallback(response) {
            $scope.coordonneesGPS = response.data; // On stock le JSON obtenu par le WebService
            placerMarkers($scope.coordonneesGPS);
            },
            function errorCallback(response) {
              alert("Echec de l'import des départements");
          })
       };


       $scope.GETobtenirMonumentsDansDepartement = function(departement) {
        //region = region.substring(0,1).toUpperCase()+region.substring(1);
         $http({
           method : 'GET',
           url : 'http://localhost:1337/obtenirMonumentsDansDepartement',
           params: {departement: departement},
           headers: {
             'Content-Type': 'application/JSON'
           },
         }).then(
             function successCallback(response) {
             $scope.monumentsInDepartement = response.data; // On stock le JSON obtenu par le WebService
             },
             function errorCallback(response) {
               alert("Echec de l'import des monuments");
           })
        };
  }]);
