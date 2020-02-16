// Imports

var measurementOp = require('../../classes/models').measurement;
var Log = require('../../classes/logger');
var config = require('../../configuration/configuration');

// Public functions

exports.get = function (req) {
  var logger = new Log();
  return new Promise(function(resolve, reject) {
    measurementOp.find({}).sort({_id:-1}).limit(20).lean()
    .then(function(response){
      resolve(response)
    })
    .catch(function(err){
      logger.error(err, 'GET_MEASUREMENT');
      reject();
    });
  });
}

exports.insert = function (req) {
  var logger = new Log();
  return new Promise(function(resolve, reject) {
    try{
      if(!req.body.thing_id || !req.body.mode || !req.body.data ){
        logger.error("Missing body [thing_id, mode, data]", 'INSERT_MEASUREMENT');
        reject();
      }
      var newMeasurement = {
        thing_id: req.body.thing_id,
        mode: req.body.mode,
        data: req.body.data
      };
    var measurementDb = new measurementOp(newMeasurement);
    measurementDb.save()
      .then(function(response){
        logger.info("New measurement added by " + response.thing_id, "INSERT_MEASUREMENT");
        resolve("success")
      })
      .catch(function(err){
        logger.error(err, 'INSERT_MEASUREMENT');
        reject();
      });
    } catch(err) {
      logger.error(err, 'INSERT_MEASUREMENT');
      reject();
    }
  });
}