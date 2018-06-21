const express = require('express');
const bodyParser = require('body-parser');
const levenshtein = require('fast-levenshtein');
const hbs  = require('express-handlebars');
const app = express();
const morgan =require('morgan');
const mongodb = require('mongodb').MongoClient;
//const mongourl = "mongodb://localhost:27017/";
const mongourl = "mongodb://ropafadzo1993:pass1234@ds231360.mlab.com:31360/scrapesites";

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
    mongodb.connect(mongourl, function(err, db) {
          if (err) throw err;
          var drugsResults=[];  
          var dbo = db.db("scrapesites");
         // dbo.collection("drugsGoodrx").createIndex({ drug: "text" });  
          var query =  { drug:new RegExp('^' + meds)} ;        
             dbo.collection("drugsGoodrx").find(query).toArray(function(error, result) {
               if (error) throw error;
              // res.render('main',result);
               var drugnamez=[];
               result.forEach(function(row){
                drugnamez.push(row.drug);
                var distance = levenshtein.get(meds, row.drug, { useCollator: true});
                row.distance= distance;

               });
                
              console.log(drugnamez)
               query = {$text: { $search: meds },drug:{$nin:drugnamez}}
                dbo.collection("drugsGoodrx").find(query).toArray(function(err, reslt){
                  if (err) throw err;
                reslt.forEach(function(row){
                 drugnamez.push(row.drug);
                 var distance = levenshtein.get(meds, row.drug, { useCollator: true});
                 row.distance= distance;

               });
                    reslt=reslt.sort(sortNumber);
                    result=result.sort(sortNumber);
                    result=result.concat(reslt);
                    res.render('main',result);
                });

            });    

function sortNumber(a,b) {
  var dist= parseInt(a.distance) - parseInt(b.distance);
  if(dist == 0){
     return parseInt(a.popularity) - parse(b.popularity);
  }else{
       return dist;
  }

}

app.listen(app.get('port'));

console.log("server listening on port " + app.get('port'));

