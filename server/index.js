// Import packages
var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var upload = multer({ dest:'uploads/'});
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var http = require('http');
var fs = require('fs');

// Import configuration
var port = process.env.PORT;
var mongoString = process.env.MONGO_STRING;

// Instantiate server app
var app = express();

// Middlewares
app.use(cors({origin:'*'}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());

// Mongo Models
var Schema = mongoose.Schema;
var picture = new Schema({
    date: { type: Date, default: Date.now },
    image: { data: Buffer, contentType: String, size: String }
});
var pictureModel = mongoose.model('picture', picture);


// Endpoints
app.get('/', (req, res) => res.send('Welcome to cyberlab server!'));
app.post('/', function(req, res){
  var body = req.body;
  res.json({error: 'false', msg: 'We got your message', payload: body});
})
app.post('/image', upload.single('picture'), function(req, res){
  if(req.file){
    // read the img file from tmp in-memory location
    var newImg = fs.readFileSync(req.file.path);
    // encode the file as a base64 string.
    var encImg = newImg.toString('base64');
    // define your new document
    var newItem = {
       // description: req.body.description,
       contentType: req.file.mimetype,
       size: req.file.size,
       data: Buffer(encImg, 'base64')
    };
    var pictureDb = new pictureModel({image: newItem});
    pictureDb.save()
    .then(function(response){
      res.json({error: false, msg: "Image received", desc: req.file});
    })
    .catch(function(err){
      console.log(err);
      res.json({error: true, msg: "Error storing image...", desc: err});
    });
  } else {
    res.json({error: true, msg: "Missing image..."});
  }
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

// START SERVER
var server = http.createServer(app);
server.listen(port, () => console.log("Server listening on port " + port));

// Export app module
module.exports = app;
