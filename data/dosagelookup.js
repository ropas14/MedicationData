var fs = require('fs');
var drugJson = require('./thedrugs.json');
var arr = [];
var editeddrugs=[];
var attributes = Object.keys(drugJson);
var dbo = "";
//var num=0;
for (var i = 0; i < attributes.length; i++) {
    item = drugJson[attributes[i]];
    if(item.dosage==""){
    	if(!item.description==""){
    		var descript=item.description;
    		var seperatestring =descript.split(/[\s;]+/);
    		var firstword=seperatestring[0];
    		var lastCharcter=firstword.length-1;		
    		if(firstword[lastCharcter]==firstword[lastCharcter].toUpperCase()){  
                  drugJson.forEach(function(drugdata){
                     if(firstword.toLowerCase()==drugdata.drug){
                     	 item.dosage=drugdata.dosage;
                     	 editeddrugs.push(item.drug);
                     	 arr.push(item);
                     }                 
                  });

                  if(editeddrugs.indexOf(item.drug) < 0){
                  	arr.push(item);
                  }
    		}
    		else{
    			arr.push(item);
    		}	
    	}
    	else{
    		 arr.push(item);
    	}    	
    }
       else{
          arr.push(item);
        }   
}

//console.log(num);
var jsonContent = JSON.stringify(arr);
fs.writeFile("drugslookup.json", jsonContent, 'utf8', function(err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
});


