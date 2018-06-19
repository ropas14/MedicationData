const express = require('express');
const bodyParser = require('body-parser');
const levenshtein = require('fast-levenshtein');
const hbs  = require('express-handlebars');
const app = express();

//app.use('/api', require('./routes/api'));
app.set('port', process.env.PORT || 3000);

const mongodb = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";

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
	console.log(meds +"========================================");


    mongodb.connect(mongourl, function(err, db) {
          if (err) throw err;
          var dbo = db.db("goodrx");
          dbo.collection("drugsGoodrx").createIndex({ drug: "text" });
          var query =  { $text: { $search: meds } };        
             dbo.collection("drugsGoodrx").find(query).toArray(function(error, result) {
               if (error) throw error;
               res.render('main',reverse(result));
            });
      
     });
    

});

app.listen(app.get('port'));

console.log("server listening on port " + app.get('port'));

 function reverse(a) {
     var temp = [];
     var len = a.length;
    for (var i = (len-1); i>=0; i--) {
        temp.push(a[i]);
    }
    return temp;
}