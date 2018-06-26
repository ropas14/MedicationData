const express = require('express');
const bodyParser = require('body-parser');
const levenshtein = require('fast-levenshtein');
const hbs  = require('express-handlebars');
const app = express();
const morgan =require('morgan');
const mongodb = require('mongodb').MongoClient;
//const mongourl = "mongodb://ropafadzo1993:pass1234@ds231360.mlab.com:31360/scrapesites";
var drugsclasses = require("./data/drugclassesCollection.json");
var drugsGoodrx = require("./data/thedrugs.json");
var drugResults=[];
 var drugnamez=[];
 

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));

app.engine('hbs', hbs({extname:'hbs' , defaultLayout:'layout',layoutsDir:__dirname +'/views/layouts/'}));
app.set('view engine','hbs');

app.get('/api/medication',function(req,res){
	var meds = req.query.search.trim().toLowerCase();	
  var drgresults=[];
  var dgclassresults=[];
  drugsGoodrx.forEach(function(result){
    var rslt = result.drug.toLowerCase();
    filteritems(meds,rslt,result);
      
   });
  drugsclasses.forEach(function(result){
    var rslt = result.drugclass.toLowerCase();
    
      filteritems(meds,rslt,result);
   });
    
      drugResults=drugResults.sort(sortNumber);
      drugnamez=drugnamez.sort(sortNumber);
      drgresults=drugResults.concat(drugnamez);
      drugResults =[];drugnamez=[];
      drugResults=drugResults.sort(sortbyDistance);
      drugnamez=drugnamez.sort(sortbyDistance);
      dgclassresults=drugResults.concat(drugnamez);
      drgresults=drgresults.concat(dgclassresults);
      res.json(drgresults);
      drugResults =[];drugnamez=[];
});


function filteritems(meds,reslt,results){
      var drugclss = [];
       if(reslt.startsWith(meds)){
        var distance = levenshtein.get(meds, reslt, { useCollator: true});
        results.distance=distance;
        drugResults.push(results);
        drugclss.push(reslt);
        }
       else if(reslt.includes(meds)){
         var num=0;
         for(var i=0 ; i<drugclss.length ; i++){
           if(drugclss[i]==rslt){
            num++;
           }
         }
      if(num==0){
        var distance = levenshtein.get(meds, reslt, { useCollator: true});
        results.distance=distance;
        drugnamez.push(results);

         }        
       }
       else{}

}


function sortNumber(a,b) {
  var dist= parseInt(a.distance) - parseInt(b.distance);
  if(dist == 0){
     return parseInt(a.popularity) - parseInt(b.popularity);
  }else{
       return dist;
  }
}

function sortbyDistance(a,b){
  var distanc = parseInt(a.distance) - parseInt(b.distance);
  return distanc;

}

app.listen(app.get('port'));

console.log("server listening on port " + app.get('port'));

