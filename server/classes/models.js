var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var picture = new Schema({
    date: { type: Date, default: Date.now },
    origin: { type: String, default: 'UNKNOWN' },
    path: { type: String, required: true },
    file: {
        mimetype: { type: String, required: true },
        size: { type: Number, required: true },
        data: { type: Buffer, required: true }
    }
});

picture.set('autoIndex',true);

module.exports.picture = mongoose.model('picture', picture);
