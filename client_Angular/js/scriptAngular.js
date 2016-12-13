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
           },
           function errorCallback(response) {
             alert("Echec de l'import des départements");
         })
      };


      $scope.GETobtenirCoordonneesGPSDuMonument = function(monumentID) {
        $http({
          method : 'GET',
          url : 'http://localhost:1337/obtenirCoordonneesGPSMonument',
          params: {monumentID: monumentID},

          headers: {
            'Content-Type': 'application/JSON'
          },
        }).then(
            function successCallback(response) {
            $scope.coordonneesGPS = response.data[0]; // On stock le JSON obtenu par le WebService
            $scope.image = response.data[1]; // On stock le JSON obtenu par le WebService
            placerMarkers($scope.coordonneesGPS,$scope.image,$scope.nomMonument);
            },
            function errorCallback(response) {
              alert("Echec de l'import des départements");
          })
       };


       $scope.GETobtenirMonumentsDansDepartement = function(departement) {
         $http({
           method : 'GET',
           url : 'http://localhost:1337/obtenirMonumentsDansDepartement',
           params: {departement: departement},
           headers: {
             'Content-Type': 'application/JSON'
           },
         }).then(
             function successCallback(response) {
             $scope.reponse = response.data;
             $scope.monuments = [];
             $scope.nomMonument;
             for(var i=0 ; i<$scope.reponse.length ; i++)
             {
               var start = $scope.reponse[i].indexOf("<TICO>")+6;
               var end = $scope.reponse[i].indexOf("</TICO>");
               $scope.nomMonument = $scope.reponse[i].slice(start,end);

               var start = $scope.reponse[i].indexOf("<REF>")+5;
               var end = $scope.reponse[i].indexOf("</REF>");
               var refMonu = $scope.reponse[i].slice(start,end);

               $scope.monuments.push([$scope.nomMonument,refMonu]);
             }

             $scope.monumentsInDepartement = $scope.monuments.sort();

             },
             function errorCallback(response) {
               alert("Echec de l'import des monuments");
           })
        };
  }]);
