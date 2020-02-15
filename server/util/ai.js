var request = require('request');
var Log = require('../classes/logger');
var config = require('../configuration/configuration');
var fs = require('fs');

exports.classify = function (img, type) {
    var logger = new Log();

    var form = { image: {
            value: img, // Upload the first file in the multi-part post
            options: {
                filename: 'image_file'
            }    
        }
    }

    var options = {
        'method': 'POST',
        'url': config.aiUrl + type,
        formData: form
    }

    return new Promise(function(resolve, reject) {
        try{
            var stream =  fs.createReadStream(config.uploadPath + 'file.json').pipe(request(options));
            var chunks = [];
            stream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            stream.on('end', function() { // Will be emitted when the input stream has ended, ie. no more data will be provided
                var buffer = Buffer.concat(chunks); // Create a buffer from all the received chunks
                resolve(buffer);
            });
        } catch(err){
            logger.error(err);
            reject(err);
        }
    });
}
