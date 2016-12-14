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

        $http({
          method : 'GET',
          url : 'http://localhost:1337/nbMonumentsinDB',

          headers: {
            'Content-Type': 'application/JSON'
          },
        }).then(
            function successCallback(response) {
            $scope.nbMonumentsinDB = response.data; // On stock le JSON obtenu par le WebService
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


      $scope.GETobtenirCoordonneesGPSDuMonument = function(nomMonument,monumentID,comMonu,regMonu,statMonu,epoqueMonu) {
        $scope.nomMonu = nomMonument;
        $scope.comMonu = comMonu;
        $scope.regMonu = regMonu;
        $scope.statMonu = statMonu;
        $scope.epoqueMonu = epoqueMonu;
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
         $scope.departement = departement;
         $http({
           method : 'GET',
           url : 'http://localhost:1337/obtenirMonumentsDansDepartement',
           params: {departement: departement},
           headers: {
             'Content-Type': 'application/JSON'
           },
         }).then(
             function successCallback(response) {
             $scope.monumentsDepartement = response.data;
             $scope.monuments = [];
             $scope.nomMonument;
             for(var i=0 ; i<$scope.monumentsDepartement.length ; i++)
             {
               var start = $scope.monumentsDepartement[i].indexOf("<TICO>")+6;
               var end = $scope.monumentsDepartement[i].indexOf("</TICO>");
               var nomMonument = $scope.monumentsDepartement[i].slice(start,end);

               start = $scope.monumentsDepartement[i].indexOf("<REF>")+5;
               end = $scope.monumentsDepartement[i].indexOf("</REF>");
               var refMonu = $scope.monumentsDepartement[i].slice(start,end);

               start = $scope.monumentsDepartement[i].indexOf("<COM>")+5;
               end = $scope.monumentsDepartement[i].indexOf("</COM>");
               var comMonu = $scope.monumentsDepartement[i].slice(start,end);

               start = $scope.monumentsDepartement[i].indexOf("<REG>")+5;
               end = $scope.monumentsDepartement[i].indexOf("</REG>");
               var regMonu = $scope.monumentsDepartement[i].slice(start,end);

               start = $scope.monumentsDepartement[i].indexOf("<STAT>")+6;
               end = $scope.monumentsDepartement[i].indexOf("</STAT>");
               var statMonu = $scope.monumentsDepartement[i].slice(start,end);

               start = $scope.monumentsDepartement[i].indexOf("<SCLE>")+6;
               end = $scope.monumentsDepartement[i].indexOf("</SCLE>");
               var epoqueMonu = $scope.monumentsDepartement[i].slice(start,end);

               $scope.monuments.push([nomMonument,refMonu,comMonu,regMonu,statMonu,epoqueMonu]);
             }

             $scope.monumentsInDepartement = $scope.monuments.sort();

             },
             function errorCallback(response) {
               alert("Echec de l'import des monuments");
           })
        };


        $scope.formatNumber = function(i) {
           return Math.round(i * 100)/100; 
        }
  }]);
