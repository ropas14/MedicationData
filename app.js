const express = require('express');
const app = express();

app.use('/api', require('./routes/api'));
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));

 console.log("server listening on port " + app.get('port'));