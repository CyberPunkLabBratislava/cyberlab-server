// Cyberlab server

// ** Start Imports **
// Import main server packages
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var http = require('http');
var mongoose = require('mongoose');

// Load configuration file
var config = require('./configuration/configuration');

// Load loggers
var morgan = require('morgan');
var logger = require('./util/logger');

// Load routes
var api = require('./api/routes/routes');

//** End imports **

// Instantiate server app
var app = express();

// Middlewares
app.use(cors({origin:'*'}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(':status - :date[iso] - :method - :url - :response-time - :remote-addr', { "stream": logger.stream}));

//** API **
app.use('/', api);

// Not found request response
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

//** END API **

// CONNECTING to MONGO
var conn_attempts = 1;
var retryConnection = function(){
  conn_attempts++;
  logger.warn('Retrying connection to mongo...');
  mongoConnect(config.mongoString, {useNewUrlParser: true, useUnifiedTopology: true});
};
var mongoConnect = function(){
  mongoose.connect(config.mongoString, {useNewUrlParser: true, useUnifiedTopology: true}, function(error){
    if (error){
      if(conn_attempts > 5){
        logger.error("Couldn't connect to data source!" + error);
        process.exit(-1);
      }
      setTimeout(retryConnection, 5000);
    } else {
      logger.info(new Date().toISOString() + " - Datasource connection established!");
    }
  });
};

mongoConnect();

// Start server
var server = http.createServer(app);
server.listen(config.port, () => logger.info(new Date().toISOString() + " - Cyberlab server initialized on port " + config.port));

// Export app module
module.exports = app;
