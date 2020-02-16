// Imports

var thingOp = require('../../classes/models').thing;
var Log = require('../../classes/logger');
var config = require('../../configuration/configuration');

// Public functions

exports.get = function (req) {
  var logger = new Log();
  return new Promise(function(resolve, reject) {
    thingOp.find({}).sort({_id:-1}).limit(20).lean()
    .then(function(response){
      resolve(response)
    })
    .catch(function(err){
      logger.error(err, 'GET_THING');
      reject();
    });
  });
}

exports.getById = function (req) {
  var logger = new Log();
  return new Promise(function(resolve, reject) {
    thingOp.findOne({"thing_id": req.params.id}).lean()
    .then(function(response){
      if(!response){
        resolve("NOT FOUND");
      } else {
        resolve(response);
      }
    })
    .catch(function(err){
      logger.error(err, 'GET_THING_BY_ID');
      reject();
    });
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
        logger.info("New thing registered " + response.thing_id, "REGISTER_THING");
        resolve(response.thing_id)
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
  var logger = new Log();
  return new Promise(function(resolve, reject) {
    thingOp.deleteOne({"thing_id": req.params.id}).lean()
    .then(function(response){
      if(!response.deletedCount){
        resolve("NOT FOUND");
      } else {
        resolve(req.params.id + " was deleted");
      }
    })
    .catch(function(err){
      logger.error(err, 'GET_THING_BY_ID');
      reject();
    });
  });
}