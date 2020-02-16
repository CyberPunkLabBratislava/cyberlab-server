var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('uuid/v1');

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

var thing = new Schema({
    created: { type: Date, default: Date.now },
    mode: { type: String, required: true },
    type: { type: String, required: true },
    id: { type: String, default: uuid() }
    // mac
    // hasItems
    // authentication
});

picture.set('autoIndex',true);
thing.set('autoIndex',true);

module.exports.picture = mongoose.model('picture', picture);
module.exports.thing = mongoose.model('thing', thing);
