
// Configuration du serveur et des modules
var express = require('express');
var app = express();
var path = require("path");
var exist = require('easy-exist');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require("fs");
var Connection = require('./existdb-node-master/index.js')
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
app.set('view engine', 'ejs');

//getRegions();

// On renvoie un tableau contenant la liste des régions
app.get('/', function (req, res) {
  /*
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
        //var display = "";
        //for(var i=0 ; i<donneesBrutes.length ; i++)
        //{
          //display += donneesBrutes[i]+"<br>";
        //}
        //res.send(display);
        res.send(donneesBrutes);
        console.log(ObtainUniqueValues(donneesBrutes));
      }
  });*/
  getRegions();
  res.send("Hello World");

});

app.get('/tt', function (req, res) {
  res.sendFile(path.join(__dirname+'/test.html'));
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
      //console.log("Item %d out of %d:", offset, hits);
      donneesBrutes.push(item.toLowerCase());
      if(offset == hits)
      {
        console.log(ObtainUniqueValues(donneesBrutes));
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
