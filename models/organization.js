//declaring schema for organization

var mongoose = require('mongoose');
var event = require('./event');
var organizationSchema = mongoose.Schema(
    {
        "name": String,
        "abbreviation": String,
        "estYear": Number,
        "type": String,
        "email": String,
        "logo": String,
        "username": String,
        "password": String,
        "events": [event.schema],
        "isOrganization": { type: Boolean, default: true }

    }, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
