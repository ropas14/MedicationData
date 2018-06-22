var fs = require('fs');
var drugJson = require('./drugsGoodrx.json');
const arr = [];
var attributes = Object.keys(drugJson);
var dbo = "";
for (var i = 0; i < attributes.length; i++) {
    item = drugJson[attributes[i]];
    item.drug = attributes[i].toLowerCase();
    arr.push(item)
}
// stringify JSON Object
var jsonContent = JSON.stringify(arr);
fs.writeFile("thedrugs.json", jsonContent, 'utf8', function(err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
});
console.log(arr);