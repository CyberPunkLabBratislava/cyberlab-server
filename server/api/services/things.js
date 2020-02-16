// Imports

var thingOp = require('../../classes/models').thing;
var Log = require('../../classes/logger');
var config = require('../../configuration/configuration');

// Public functions

exports.get = function (req) {
  return new Promise(function(resolve, reject) {
    resolve("Under construction")
  });
}

exports.getById = function (req) {
  return new Promise(function(resolve, reject) {
    resolve("Under construction")
  });
}

exports.register = function (req) {
  var logger = new Log();
  return new Promise(function(resolve, reject) {
    try{
      if(!req.body.type || !req.body.mode){
        logger.error("Missing body [type, mode]", 'REGISTER_THING');
        reject();
      }
      var newThing = {
        // description: req.body.description,
        mode: req.body.mode,
        type: req.body.type
      };
    var thingDb = new thingOp(newThing);
    thingDb.save()
      .then(function(response){
        logger.info("New thing registered " + response._id, "REGISTER_THING");
        resolve(response._id)
      })
      .catch(function(err){
        logger.error(err, 'REGISTER_THING');
        reject();
      });
    } catch(err) {
      logger.error(err, 'REGISTER_THING');
      reject();
    }
  });
}

exports.remove = function (req) {
  return new Promise(function(resolve, reject) {
    resolve("Under construction")
  });
}