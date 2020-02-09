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
  var img_data = [];
  return new Promise(function(resolve, reject) {
    req.on('data', function (chunk) {
        img_data.push(chunk)
        f.write(chunk);
    });
    req.on('end', function () {
      f.end();
      var img = Buffer.concat(img_data);
      //*** Store Metadata in Mongo ***
      storeInMongo(userIP, size, mimeType, imagePath, img)
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

exports.retrieveImageMetadata = function (req){
    var logger = new Log();
    var userIP = req.socket.remoteAddress;
    var images;
    return new Promise(function(resolve, reject) {
    pictureModel.find({}).select({'file.data': 0}).sort({_id:-1}).limit(50).lean()
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

exports.getLastImage = function (req){
  var logger = new Log();
  return new Promise(function(resolve, reject) {
  pictureModel.find({}).select({file: 1, _id: 0}).sort({_id:-1}).limit(1)
  .then(function(response){
    resolve(response[0].file.data);
  })
  .catch(function(err){
    logger.error(err, 'GET_LAST_IMAGE');
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
      var img = fs.readFileSync(imagePath);
      //*** Store in Mongo ***
      storeInMongo(userIP, size, mimeType, imagePath, img)
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
function storeInMongo(origin, size, mimetype, path, img){
    // define your new document
    var newItem = {
       // description: req.body.description,
       path: path,
       origin: origin,
       file:
        { size: size,
          mimetype: mimetype,
          data: Buffer(img.toString('base64'), 'base64') 
        }
    };
    var pictureDb = new pictureModel(newItem);
    return pictureDb.save();
  }