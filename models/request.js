//declaring schema for user

var mongoose = require('mongoose');
var event = require('./event');


//the password field will need encryption later on
var requestSchema = mongoose.Schema(
    {
        eventId: String,
        userName: String,
        userId: mongoose.Types.ObjectId,
        status: String,
        reasons: String,
        event: event.schema,
        ownerId: mongoose.Types.ObjectId

    }, { timestamps: true }); //generates create/updated time of object

module.exports = mongoose.model('Request', requestSchema);
