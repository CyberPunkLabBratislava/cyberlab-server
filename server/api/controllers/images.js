var sImages = require('../services/images');

exports.get = function (req, res, next) {
  sImages.retrieveImage(req)
  .then((response)=>{res.json(response)})
  .catch(()=>{res.send('Something went wrong, please check the logs for more info.')});  
};

exports.post = function (req, res, next) {
  sImages.saveImage(req)
  .then((response)=>{res.json({error: false, id: response.id})})
  .catch(()=>{res.json({error: true, message: 'Something went wrong, please check the logs for more info.'}) });  
};

exports.postform = function (req, res, next) {
  sImages.saveImage_multer(req)
  .then((response)=>{res.json({error: false, msg: "Nothing to say..."})})
  .catch(()=>{res.json({error: true, message: 'Something went wrong, please check the logs for more info.'}) });  
};
