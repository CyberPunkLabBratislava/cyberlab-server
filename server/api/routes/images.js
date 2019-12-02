var express = require('express'),
router = express.Router(),
images = require('../controllers/images');

module.exports = router
  .get('', images.get)
  .post('', images.post)
