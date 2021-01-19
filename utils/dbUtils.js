//databse utility function to check if user type is organization or not


const Organization = require('../models/organization');

const isOrganization = function(email) {
    return Organization.findOne({
        email: email
    })
    .then(organization => {
        if (organization) {
            return true;
        } else {
            return false;
        } 
    })
    .catch(err => {
        console.log(err);
    })
};

module.exports.isOrganization = isOrganization;

