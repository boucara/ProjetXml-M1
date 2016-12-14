
// Configuration du serveur et des modules
var express = require('express');
var app = express();
var path = require("path");
var exist = require('easy-exist');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require("fs");
var xml = require('xml');
var Connection = require('./existdb-node-master/index.js');
var format = require('string-format');
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
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static('../client_angular'));

app.get('/', function (req, res, err) {
  res.sendFile(path.join(__dirname+"/../client_Angular/client.html"));
});

app.get('/obtenirRegions', function (req, res) {
  res.set('Content-Type', 'text/json');
  var xquery = fs.readFileSync("foncRegions.xql", "UTF-8");
  var getRegions = connection.query(xquery, { chunkSize: 20 });
  getRegions.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutes = new Array();
  getRegions.bind().each(function(item, hits, offset) {
      donneesBrutes.push(item);
      if(offset == hits)
      {
        res.send(donneesBrutes.sort());
      }
  });
});


app.get('/nbMonumentsinDB', function (req, res) {
  res.set('Content-Type', 'text/json');
  var xquery = fs.readFileSync("foncNbMonumentsInDB.xql", "UTF-8");
  var getNbMonuments = connection.query(xquery, { chunkSize: 20 });
  getNbMonuments.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutes = new Array();
  getNbMonuments.bind().each(function(item, hits, offset) {
      donneesBrutes.push(item);
      if(offset == hits)
      {
        res.send(donneesBrutes);
      }
  });
});


app.get('/obtenirDepartement', function (req, res) {
  var getDeparte = connection.query('distinct-values(for $i in collection("monuments")//row where $i//REG="'+req.query.region+'" order by $i//DPT return $i//DPT)', { chunkSize: 20 });
  console.log(req.query.region);
  console.log(format(req.query.region));
  getDeparte.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutesDeparte = new Array();
  getDeparte.bind().each(function(item, hits, offset) {
      donneesBrutesDeparte.push(item);
      if(offset == hits)
      {
        res.send(donneesBrutesDeparte.sort());
      }
  });
});



app.get('/obtenirMonumentsDansDepartement', function (req, res) {
  var getMonumentDansDepartement = connection.query('for $i in collection("monuments")//row where $i//DPT="'+req.query.departement+'" order by $i//DPT return $i',  { chunkSize: 20 });
  getMonumentDansDepartement.on("error", function(err) {
      console.log("An error occurred: " + err);
  });
  var donneesBrutesMonu = new Array();
  getMonumentDansDepartement.bind().each(function(item, hits, offset) {
      donneesBrutesMonu.push(item);
      if(offset == hits)
      {
        res.set('Content-Type', 'text/json');
        res.send(donneesBrutesMonu);
      }
  });


});

app.get('/obtenirCoordonneesGPSMonument', function (req, res) {
              var sparql ='SELECT ?label ?coord ?image WHERE { ?subj wdt:P380  "'+req.query.monumentID+'" . ?subj wdt:P18 ?image .?subj wdt:P625 ?coord .?subj rdfs:label ?label SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }}';
              var url = wdk.sparqlQuery(sparql);
              request('http://query.wikidata.org/sparql?format=json&query='+sparql, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  var object = parser.parse(body);
                  if(object.results.bindings[0]!=null)
                  {
                    var coordonneesGPS = object.results.bindings[0].coord.value;
                    coordonneesGPS = coordonneesGPS.split("(");
                    coordonneesGPS = coordonneesGPS[1].split(")");
                    coordonneesGPS = coordonneesGPS[0].split(" ");
                    var image = object.results.bindings[0].image.value;
                    res.send([coordonneesGPS,image]);
                  }
                  else
                  {
                      console.log("Pas de monument pour cet ID");
                      res.send("Pas de monument pour cet ID");
                  }
              }
            });
});
