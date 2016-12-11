
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
// test inclusion sparql


 

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

app.get('/', function (req, res) {
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

// Obtenir une liste de livres, y compris leurs genres. La liste sera formaté ou groupés par genres

