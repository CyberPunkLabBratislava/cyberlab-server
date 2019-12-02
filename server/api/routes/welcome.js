var express = require('express'),
router = express.Router();

// respond with "hello world" when a GET request is made to the homepage
module.exports = router
  .get('', function(req, res, next){
    res.send('Welcome to cyberlab server');
  });
