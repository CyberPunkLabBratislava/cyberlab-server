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
    thing_id: { type: String, default: uuid() }
    // mac
    // hasItems
    // authentication
});

var measurement = new Schema({
    created: { type: Date, default: Date.now },
    mode: { type: String, required: true },
    thing_id: { type: String, required: true },
    data: { type: Number, required: true  }
    // data: { [ measurement_key, measurement_value, measurement_value_type, timestamp, camera_id]}
});

picture.set('autoIndex',true);
thing.set('autoIndex',true);
measurement.set('autoIndex',true);

module.exports.picture = mongoose.model('picture', picture);
module.exports.thing = mongoose.model('thing', thing);
module.exports.measurement = mongoose.model('measurement', measurement);
