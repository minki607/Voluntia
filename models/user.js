//declaring schema for user

var mongoose = require('mongoose');
const request = require('../models/request');


var userSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        username: String,
        password: String,
        email: String,
        phone: String,
        bio: String,
        experience: String,
        events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
        bookedRequest: [request.schema],
        accountType: String,
        isVolunteer: { type: Boolean, default: true }

    }, { timestamps: true }); //generates create/updated time of object

module.exports = mongoose.model('User', userSchema);
