var express = require('express'),
router = express.Router(),
images = require('../controllers/images');

// respond with "hello world" when a GET request is made to the homepage
module.exports = router
  .get('', function(req, res, next){
    res.send('Welcome to cyberlab server');
  })
  .get('/image', images.get)
  .post('/image', images.post)
  .post('/imageform', images.postform);
