const express = require('express');
const router = express.Router();
var levenshtein = require('fast-levenshtein');

const mongodb = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/"

router.get('/medication/?search=:all',function(req,res){
	var meds = req.params.all.trim();
	if(meds.includes("%20")){
		meds=meds.replace("%20"," ");
	}
	else{meds;}
	console.log(meds +"========================================");
    mongodb.connect(mongourl, function(err, db) {
          if (err) throw err;
          var dbo = db.db("goodrx");          
             dbo.collection("drugsIndetail").find({condition:meds}, function(error, result) {
               if (error) throw error;
               console.log(result);
            });
      
     });


});

router.get('/', function(req,res){

	res.send("here we are");
})



module.exports=router;