const express = require('express');
const bodyParser = require('body-parser');
const levenshtein = require('fast-levenshtein');
const hbs  = require('express-handlebars');
const app = express();
const mongodb = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));

app.engine('hbs', hbs({extname:'hbs' , defaultLayout:'layout',layoutsDir:__dirname +'/views/layouts/'}));
app.set('view engine','hbs');

app.get('/api/medication',function(req,res){
	var meds = req.query.search.trim().toLowerCase();
	if(meds.includes("%20")){
	  meds=meds.replace("%20"," ");
	}
	else{meds;}
	
    mongodb.connect(mongourl, function(err, db) {
          if (err) throw err;
          var drugsResults=[];  
          var dbo = db.db("goodrx");
          dbo.collection("drugsGoodrx").createIndex({ drug: "text" });
          var query =  { $text: { $search: meds } };        
             dbo.collection("drugsGoodrx").find(query).toArray(function(error, result) {
               if (error) throw error;
               var output= reverse(result);
               output.forEach(function(drug){
                drugsResults.push(drug);  
               });
           
        
        var drugitem={};
        var drgdist=[];
        var drugnames = [];
         dbo.collection("drugsGoodrx").find().toArray(function(err,rslt){
            if(err) throw err;
            rslt.forEach(function(data){
            var distance = levenshtein.get(meds, data.drug, { useCollator: true});
            // drug distance as key , drug as value
            drugitem[distance] = data.drug;
            //push leven distance in an array
            drgdist.push(distance);
            //push they  distance and drug object in drugnames array
            drugnames.push(drugitem);
            drugitem = {}; 	
            }); 
            // sort distances in ascending order
            drgdist.sort(sortNumber);
            //assign closestdistance which is not=0, by default drgdist[0] is equal to zero
            var closedistance= drgdist[1];  
            //loop in the array of drugnames objects          
            	drugnames.forEach(function(dg){
                 var Keys = Object.keys(dg);
                 //if closestdistance is equal to the object key enter loop
                 if(closedistance.toString()===Keys[0]){
                      var name = dg[Keys[0]];
                      console.log("----------------------------------- " + name);
                     dbo.collection("drugsGoodrx").find({drug:name}).toArray(function(errr, rsult) {
                     if (errr) throw errr;   
                      console.log(rsult.pop()); 
                     //push object result in the drugsResults array           
                   	  drugsResults.push(rsult.pop());                                     	   
                      });
                     
                 }              
            	});
           console.log(drugsResults);  
           res.render('main',drugsResults);    
          });       
      });               
      
     });
    
});

function reverse(a) {
     var temp = [];
     var len = a.length;
     for (var i = (len-1); i>=0; i--) {
        temp.push(a[i]);
     }
     return temp;
}

function sortNumber(a,b) {
    return a - b;
}

app.listen(app.get('port'));

console.log("server listening on port " + app.get('port'));

