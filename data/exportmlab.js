const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://ropafadzo1993:pass1234@ds231360.mlab.com:31360/scrapesites";

const drugJson = require("./thedrugs.json");

 MongoClient.connect(mongourl, function(rr, db) {
      if (rr) {isfound=false; return;}
      var dbo = db.db("scrapesites");
      drugJson.forEach(function(items){
      	//console.log(items);
       dbo.collection("drugsGoodrx").insertOne(items,function(errr, reslts) {
          if (errr) {throw errr;return;}
          console.log("==+++++++++++saved");
         
      });
      });
     
    });