var sThings = require('../services/things');

exports.get = function (req, res, next) {
  sThings.get(req)
  .then((response)=>{res.json({error: false, message: response})})
  .catch(()=>{res.send('Something went wrong, please check the logs for more info.')});  
};

exports.getById = function (req, res, next) {
  sThings.getById(req)
  .then((response)=>{res.json({error: false, message: response})})
  .catch(()=>{res.send('Something went wrong, please check the logs for more info.')});  
};

exports.register = function (req, res, next) {
  sThings.register(req)
  .then((response)=>{res.json({error: false, id: response})})
  .catch(()=>{res.json({error: true, message: 'Something went wrong, please check the logs for more info.'}) });  
};

exports.remove = function (req, res, next) {
  sThings.remove(req)
  .then((response)=>{res.json({error: false, id: response})})
  .catch(()=>{res.json({error: true, message: 'Something went wrong, please check the logs for more info.'}) });  
};
