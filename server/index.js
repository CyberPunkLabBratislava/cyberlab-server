// Import packages
var express = require('express');
var mongoose = require('mongoose');

// Import configuration
var port = process.env.PORT;
var mongoString = process.env.MONGO_STRING;

// Instantiate server app
var app = express();

// Endpoints
app.get('/', (req, res) => res.send('Welcome to cyberlab server!'));
app.post('/', function(req, res){
  var body = req.body;
  res.json({error: 'false', msg: 'We got your message', payload: body});
})

// CONNECTING to MONGO
var conn_attempts = 1;
var retryConnection = function(){
  conn_attempts++;
  console.log('Retrying connection to mongo...');
  mongoConnect(mongoString, {useNewUrlParser: true});
};
var mongoConnect = function(){
  mongoose.connect(mongoString, {useNewUrlParser: true}, function(error){
    if (error){
      if(conn_attempts > 5){
        console.log("Couldn't connect to data source!" + error);
        process.exit(-1);
      }
      setTimeout(retryConnection, 5000);
    } else {
      console.log("Datasource connection established!");
    }
  });
};

mongoConnect();

// Start server
app.listen(port, () => console.log("Server listening on port " + port))
