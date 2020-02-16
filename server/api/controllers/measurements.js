var sMeasurements = require('../services/measurements');

exports.get = function (req, res, next) {
  sMeasurements.get(req)
  .then((response)=>{res.json({error: false, message: response})})
  .catch(()=>{res.send('Something went wrong, please check the logs for more info.')});  
};

exports.insert = function (req, res, next) {
  sMeasurements.insert(req)
  .then((response)=>{res.json({error: false, message: response})})
  .catch(()=>{res.send('Something went wrong, please check the logs for more info.')});  
};

