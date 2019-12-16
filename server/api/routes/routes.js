var express = require('express'),
router = express.Router(),
images = require('../controllers/images'),
config = require('../../configuration/configuration'),
multer = require('multer'),
storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
}),
upload = multer({storage: storage});

// respond with "hello world" when a GET request is made to the homepage
module.exports = router
  .get('', function(req, res, next){
    res.send('Welcome to cyberlab server');
  })
  .get('/image', images.get)
  .post('/image', images.post)
  .post('/imageform', upload.single('picture'), images.postform);
