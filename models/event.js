//declaring schema for event

var mongoose = require('mongoose');
var eventSchema = mongoose.Schema(
    {

        "name":String,
        "type":String,
        "location":String,
        "description":String,
        "date": Date,
        "image": {
                type:String,
                default: 'https://getuikit.com/v2/docs/images/placeholder_600x400.svg' //default image template
        },
        "organizationId": String //to keep track of who created the event
    }
);

module.exports = {
        model : mongoose.model('Event', eventSchema),
        schema : eventSchema
}
