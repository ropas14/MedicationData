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
  var drugResults=[];
  var drugnamez=[];
   drugsGoodrx.forEach(function(result){
    var rslt = result.drug.toLowerCase();
    var drugclss = [];
       if(rslt.startsWith(meds)){
        var distance = levenshtein.get(meds, rslt, { useCollator: true});
        result.distance=distance;
        drugResults.push(result);
        drugclss.push(rslt);
        }
       else if(rslt.includes(meds)){
         var num=0;
         for(var i=0 ; i<drugclss.length ; i++){
           if(drugclss[i]==rslt){
            num++;
           }
         }
      if(num==0){
        var distance = levenshtein.get(meds, rslt, { useCollator: true});
        result.distance=distance;
        drugnamez.push(result);

         }        
       }
       else{}
      
   });

      drugResults=drugResults.sort(sortNumber);
      drugnamez=drugnamez.sort(sortNumber);
      drugResults=drugResults.concat(drugnamez);
      res.render('main',drugResults);
});

app.get("/api/drugsclass" , function(req,res){
  var dgclass = req.query.search.trim().toLowerCase();
  var classification = [];
  var classif=[];
   drugsclasses.forEach(function(result){
    var rslt = result.drugclass.toLowerCase();
    var drugclss = [];
       if(rslt.startsWith(dgclass)){
        var distance = levenshtein.get(dgclass, rslt, { useCollator: true});
        result.distance=distance;
        classification.push(result);
        drugclss.push(rslt);
        }
       else if(rslt.includes(dgclass)){
         var num=0;
         for(var i=0 ; i<drugclss.length ; i++){
           if(drugclss[i]==rslt){
            num++;
           }
         }
      if(num==0){
        var distance = levenshtein.get(dgclass, rslt, { useCollator: true});
        result.distance=distance;
        classif.push(result);

         }        
       }
       else{}
      
   });
    classification=classification.sort(sortbyDistance);
    classif=classif.sort(sortbyDistance);
    classification=classification.concat(classif);
    res.render('drgclasses',classification);

}); 

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

