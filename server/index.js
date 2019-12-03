// Cyberlab server

// ** Start Imports **
// Import main server packages
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var http = require('http');

// Load configuration file
var config = require('./configuration/configuration');

// Load loggers
var morgan = require('morgan');
var logger = require('./util/logger');

// Load routes
var welcome = require('./api/routes/welcome');
var images = require('./api/routes/images');

//** End imports **

// Instantiate server app
var app = express();

// Middlewares
app.use(cors({origin:'*'}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(':status - :date[iso] - :method - :url - :response-time - :remote-addr', { "stream": logger.stream}));

//** API **
app.use('/', welcome);
app.use('/image', images);

// Not found request response
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

//** END API **

// Start server
var server = http.createServer(app);
server.listen(3000, () => console.log("Server listening on port " ));

// Export app module
module.exports = app;
