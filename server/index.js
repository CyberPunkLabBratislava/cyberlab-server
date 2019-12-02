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

// Mongo Models
var Schema = mongoose.Schema;
var picture = new Schema({
    date: { type: Date, default: Date.now },
    image: { data: Buffer, contentType: String, size: Number }
});
var pictureModel = mongoose.model('picture', picture);


// Endpoints
app.get('/', (req, res) => res.send('Welcome to cyberlab server!'));
app.post('/', function(req, res){
  var body = req.body;
  res.json({error: 'false', msg: 'We got your message', payload: body});
})
app.post('/form', upload.single('picture'), function(req, res){
  if(req.file){
    // read the img file from tmp in-memory location
    var newImg = fs.readFileSync(req.file.path);
    // encode the file as a base64 string.
    var encImg = newImg.toString('base64');
    // Call Mongo
    storeImage(encImg, req.file.size, req.file.mimetype)
    .then(function(response){
      res.json({error: false, msg: "Image received", desc: req.file});
    })
    .catch(function(err){
      console.log(err);
      res.json({error: true, msg: "Error storing image..."});
    });
  } else {
    res.json({error: true, msg: "Missing image..."});
  }
})
app.post('/image', function(req, res){
  //*** Store as file ***
  // var f = fs.createWriteStream('uploads/out.jpeg');
  // req.on('data', function (data) {
  //     f.write(data);
  // });
  // req.on('end', function () {
  //     f.end();
  // });
  //*** Store in Mongo ***
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString('base64');
    storeImage(body, Buffer.byteLength(body), "image/jpeg")
    .then(function(response){
      console.log("Image stored!");
      res.end("Image received");
    })
    .catch(function(err){
      console.log(err);
      res.end("Something went wrong...");
    });
  });
})
app.get('/image', function(req, res){
  pictureModel.findOne({},{"image.data": 1}).sort({_id:-1}).limit(1)
  .then(function(response){
    var img = respose.image.data;
    res.end(img);
  })
  .catch(function(err){
    console.log(err);
    res.end("Something went wrong...");
  });
})

// OTHER FUNCTIONS
// Store image
function storeImage(payload, size, mimetype){
  // define your new document
  var newItem = {
     // description: req.body.description,
     contentType: mimetype,
     size: size,
     data: Buffer(payload, 'base64')
  };
  var pictureDb = new pictureModel({image: newItem});
  return pictureDb.save();
}

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
