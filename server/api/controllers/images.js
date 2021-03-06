var sImages = require('../services/images');

exports.get = function (req, res, next) {
  sImages.retrieveImageMetadata(req)
  .then((response)=>{res.json(response)})
  .catch(()=>{res.send('Something went wrong, please check the logs for more info.')});  
};

exports.getLastImage = function (req, res, next) {
  sImages.getLastImage(req)
  .then((response)=>{
    res.end(response);
    })
  .catch(()=>{res.send('Something went wrong, please check the logs for more info.')});  
};

exports.post_parking = function (req, res, next) {
  sImages.saveImage(req, "classify")
  .then((response)=>{res.json({error: false, id: response.id})})
  .catch(()=>{res.json({error: true, message: 'Something went wrong, please check the logs for more info.'}) });  
};

exports.post_traffic = function (req, res, next) {
  sImages.saveImage(req, "detect")
  .then((response)=>{res.json({error: false, id: response.id})})
  .catch(()=>{res.json({error: true, message: 'Something went wrong, please check the logs for more info.'}) });  
};

exports.postform = function (req, res, next) {
  sImages.saveImage_multer(req)
  .then((response)=>{res.json({error: false, id: response.id})})
  .catch(()=>{res.json({error: true, message: 'Something went wrong, please check the logs for more info.'}) });  
};
