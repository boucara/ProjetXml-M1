
// Configuration du serveur et des modules
var express = require('express');
var app = express();
var path = require("path");
var exist = require('easy-exist');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require("fs");
var xml = require('xml');
var Connection = require('./existdb-node-master/index.js')

var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'https://query.wikidata.org';

var wdk = require('wikidata-sdk');
var http = require('http');

http.post = require('http-post');
var request = require('request');
var parser = require('json-parser');
var wait=require('wait.for');
var async = require('async');
var yolo = "zzzzz";
var IDMonument;
var tab2 = new Array();

var options = {
    host: "localhost",
    port: 8080,
    rest: "/exist/rest",
    auth: "admin:"
};
var connection = new Connection(options);
const PORT=1337;
app.listen(PORT, function () {
  console.log('Example app listening on port '+PORT);
});
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static('../client_angular'));

app.get('/', function (req, res, err) {
  res.sendFile(path.join(__dirname+"/../client_Angular/client.html"));
});

app.get('/obtenirRegions', function (req, res) {
  res.set('Content-Type', 'text/json');
  var xquery = fs.readFileSync("foncRegions.xql", "UTF-8");
  var getRegions = connection.query(xquery, { chunkSize: 20 });  // chunckSize = nombre de doc à retourner
  getRegions.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutes = new Array();
  getRegions.bind().each(function(item, hits, offset) {
      donneesBrutes.push(item.toLowerCase());
      if(offset == hits)
      {
        res.send(ObtainUniqueValues(donneesBrutes));
      }
  });
});

app.get('/obtenirDepartement', function (req, res) {
  console.log(req.query.region);
  var getDeparte = connection.query("distinct-values(for $i in collection('monuments')//row where $i//REG='"+req.query.region+"' order by $i//DPT return $i//DPT)", { chunkSize: 20 });  // chunckSize = nombre de doc à retourner
  getDeparte.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutesDeparte = new Array();
  getDeparte.bind().each(function(item, hits, offset) {
      donneesBrutesDeparte.push(item);
      if(offset == hits)
      {
        res.send(ObtainUniqueValues(donneesBrutesDeparte));
      }
  });
});



app.get('/obtenirMonumentsDansDepartement', function (req, res) {
  var getMonumentDansDepartement = connection.query("distinct-values(for $i in collection('monuments')//row where $i//DPT='"+req.query.departement+"' order by $i//DPT return $i//TICO)",  { chunkSize: 20 });
  getMonumentDansDepartement.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutesMonu = new Array();
  //console.log(getMonumentDansDepartement.length);
  getMonumentDansDepartement.bind().each(function(item, hits, offset) {
      donneesBrutesMonu.push(item);
      if(offset == hits)
      {
        //console.log(donneesBrutesMonu);
        res.send(donneesBrutesMonu);
      }
  });


});

app.get('/obtenirCoordonneesGPSMonumentsDansDepartement', function (req, res) {
  var getNumeroMonumentDansDepartement = connection.query("distinct-values(for $i in collection('monuments')//row where $i//DPT='"+req.query.departement+"' order by $i//DPT return $i//REF)",  { chunkSize: 20 });
  getNumeroMonumentDansDepartement.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutesRef = new Array();
  getNumeroMonumentDansDepartement.bind().each(function(item, hits, offset) {
      donneesBrutesRef.push(item);
      if(offset == hits)
      {
        var coordonneesGPS = null;
        console.log("nb réponse "+donneesBrutesRef.length);
        var positions = new Array();
          //console.log(donneesBrutesRef[i]);
          //function getGPS(donneesBrutesRef)
          //{
            var i=0;
            //var compteur=0;
            while(i<10)
            {
              var sparql ="SELECT ?label ?coord ?image WHERE { ?subj wdt:P380  '"+donneesBrutesRef[i]+"' . ?subj wdt:P18 ?image .?subj wdt:P625 ?coord .?subj rdfs:label ?label SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }}";
              var url = wdk.sparqlQuery(sparql);
              IDMonument = donneesBrutesRef[i];
              request('http://query.wikidata.org/sparql?format=json&query='+sparql, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  var object = parser.parse(body);
                  if(object.results.bindings[0]!=null)
                  {
                    var coordonneesGPS = object.results.bindings[0].coord.value;
                    coordonneesGPS = coordonneesGPS.split("(");
                    coordonneesGPS = coordonneesGPS[1].split(")");
                    coordonneesGPS = coordonneesGPS[0].split(" ");
                    //positions.push(coordonneesGPS);
                    //console.log(coordonneesGPS[0]+" "+coordonneesGPS[1]);
                    //compteur++;
                    //res.send(coordonneesGPS);
                    //console.log(coordonneesGPS);
                    tab2.push(coordonneesGPS);
                  }
                  else
                  {
                      //console.log("Pas de monument pour cet ID");
                      //compteur++;
                  }
                  //tab2.push(coordonneesGPS);
                  //console.log(coordonneesGPS);
                  //console.log(tab2);
                }
              });
              i++;
            }
            while(true)
            {
              //console.log(i);
              if(i==10)
              {
                res.send(tab2);
              }
            }
            //setTimeout(console.log("FINIIIIIIIIIII"), 300000);
          }
  });
});


/*
app.get('/obtenirVille', function (req, res) {
  console.log(req.query.region);
  var getDeparte = connection.query("distinct-values(for $i in collection('monuments')//row where $i//REG='"+req.query.region+"' order by $i//DPT return $i//DPT)", { chunkSize: 20 });  // chunckSize = nombre de doc à retourner
  getDeparte.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutesDeparte = new Array();
  getDeparte.bind().each(function(item, hits, offset) {
      donneesBrutesDeparte.push(item);
      if(offset == hits)
      {
        res.send(ObtainUniqueValues(donneesBrutesDeparte));
      }
  });
});*/



function getRegions()
{
  var xquery = fs.readFileSync("fonc.xql", "UTF-8");
  var getRegions = connection.query(xquery, { chunkSize: 20 });  // chunckSize = nombre de doc à retourner
  getRegions.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutes = new Array();
  getRegions.bind().each(function(item, hits, offset) {
      donneesBrutes.push(item.toLowerCase());
      if(offset == hits)
      {
        GestionTailleReponse(ObtainUniqueValues(donneesBrutes).length);
        return ObtainUniqueValues(donneesBrutes);
      }
  });
}

function GestionTailleReponse(hits)
{
  console.log("Nombre de réponse : "+hits);
}

function ObtainUniqueValues(tab)
{
    return tab.filter((v, i, a) => a.indexOf(v) === i).sort();
}
/*query.bind().each(function(item, hits, offset) {
    //console.log("Item %d out of %d:", offset, hits);
    console.log(item);
});*/
