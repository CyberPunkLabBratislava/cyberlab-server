// Imports

var pictureModel = require('../../classes/models').picture;
var fs = require('fs');
var Log = require('../../classes/logger');

// Public functions

exports.saveImage = function (req) {
  var logger = new Log();
  var userIP = req.socket.remoteAddress;
  var timestamp = new Date().getTime();
 //*** Store as file ***
  var f = fs.createWriteStream('uploads/' + userIP + '/' + timestamp + '.jpeg');
  req.on('data', function (data) {
      f.write(data);
  });
  req.on('end', function () {
      f.end();
  });
  //*** Store in Mongo ***
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString('base64');
    storeImage(userIP, body, Buffer.byteLength(body), "image/jpeg")
    .then(function(response){
      logger.info("Image stored by : " + userIP, "POST_IMAGE");
      Promise.resolve({id: response._id,size: Buffer.byteLength(body)})
    })
    .catch(function(err){
      logger.error(err, 'POST_IMAGE');
      Promise.reject();
    });
  });
}

exports.retrieveImage = function (req){
    var logger = new Log();
    var userIP = req.socket.remoteAddress;
    pictureModel.findOne({},{"image.data": 1}).sort({_id:-1}).limit(1)
    .then(function(response){
      var img = response.image.data;
      logger.info('Image retrieved by: ' + userIP, 'GET_IMAGE')
      Promise.resolve(img);
    })
    .catch(function(err){
      logger.error(error, 'GET_IMAGE');
      Promise.reject();
    });
}

// Private functions

// Store image
function storeImage(origin, payload, size, mimetype){
    // define your new document
    var newItem = {
       // description: req.body.description,
       contentType: mimetype,
       size: size,
       data: Buffer(payload, 'base64')
    };
    var pictureDb = new pictureModel({origin: origin, image: newItem});
    return pictureDb.save();
  }