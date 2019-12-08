var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var picture = new Schema({
    date: { type: Date, default: Date.now },
    origin: { type: String, default: 'UNKNOWN' },
    image: { data: Buffer, contentType: String, size: Number }
});

picture.set('autoIndex',true);

module.exports.picture = mongoose.model('picture', picture);
