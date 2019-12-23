// Imports

var pictureModel = require('../../classes/models').picture;
var fs = require('fs');
var Log = require('../../classes/logger');
var config = require('../../configuration/configuration');

// Public functions

exports.saveImage = function (req) {
  var logger = new Log();
  var userIP = req.socket.remoteAddress;
  var size = req.headers['content-length'];
  var mimeType = req.headers['content-type'];
  var timestamp = new Date().getTime();
  var imagePath = config.uploadPath + timestamp + '.jpeg';
  var f = fs.createWriteStream(imagePath);
  return new Promise(function(resolve, reject) {
    req.on('data', function (data) {
        f.write(data);
    });
    req.on('end', function () {
      f.end();
      //*** Store Metadata in Mongo ***
      storeMetadata(userIP, size, mimeType, imagePath)
      .then(function(response){
        logger.info("Image stored by : " + userIP, "POST_IMAGE");
        resolve({id: response._id})
      })
      .catch(function(err){
        logger.error(err, 'POST_IMAGE');
        reject();
      });
    });
  });
}

exports.retrieveImage = function (req){
    var logger = new Log();
    var userIP = req.socket.remoteAddress;
    var images;
    return new Promise(function(resolve, reject) {
    pictureModel.find({}).sort({_id:-1}).limit(50).lean()
    .then(function(response){
      images = response;
      return pictureModel.count()
    })
    .then(function(response){
      var count = response;
      var output = {};
      output.info = "See list of last 50 pictures and total count."
      output.count = count;
      output.images = images;
      logger.info('Images info retrieved by: ' + userIP, 'GET_IMAGES')
      resolve(output);
    })
    .catch(function(err){
      logger.error(err, 'GET_IMAGES');
      reject();
    });
  });
}

exports.saveImage_multer = function(req, res, next){
  var logger = new Log();
  if(req.file){
    return new Promise(function(resolve, reject) {
      var userIP = req.socket.remoteAddress;
      var size = req.file.size;
      var mimeType = req.file.mimetype;
      var imagePath = config.uploadPath + req.file.originalname;
      //*** Store Metadata in Mongo ***
      storeMetadata(userIP, size, mimeType, imagePath)
      .then(function(response){
        logger.info("Image stored by : " + userIP, "POST_IMAGE");
        resolve({id: response._id})
      })
      .catch(function(err){
        logger.error(err, 'POST_IMAGE');
        reject();
      });
    });
  } else {
    logger.error("Missing image...");
    res.json({error: true, msg: "Missing image..."});
  }
}

// Private functions

// Store image
function storeMetadata(origin, size, mimetype, path){
    // define your new document
    var newItem = {
       // description: req.body.description,
       contentType: mimetype,
       size: size,
       origin: origin,
       path: path
    };
    var pictureDb = new pictureModel(newItem);
    return pictureDb.save();
  }