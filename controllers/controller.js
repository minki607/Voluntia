//controller file that defines most functionality of the website

var mongoose = require('mongoose');
const eventModule = require('../models/event');
const Event = eventModule.model;
const User = require('../models/user');
const Organization = require('../models/organization');
const dbUtils = require('../utils/dbUtils');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Request = require('../models/request');



//homepage event that fetches recently added event + user name with the most completed event through database
const homePageEvent = async function (req, res, next) {

    //For logged in users, first checking if logged in account is
    // org account or not for correct dashboard redirection button in navbar
    var isOrg = false;
    if (req.isAuthenticated()){
        const { user: { isOrganization } } = req;
        isOrg = isOrganization
    }

    //aggregate query is done to combine user document with request document
    //aggregation is done on userId and grouped to provide the total number of request documents per userID
    //the top 3 is fetched with sorting in descending order and limiting by 3
    var userquery = User.aggregate([

        {
            $lookup: {
                from: "requests",
                localField: "_id",
                foreignField: "userId",
                as: "completeRequest"
            }
        },
        {$unwind:"$completeRequest"},
        {$match:{"completeRequest.status": 'complete'}},
        {$group: {_id: {
                    _id: "$_id",
                    firstName: "$firstName",
                    lastName: "$lastName",

                }, count: {$sum: 1}}},
        {$sort:{count: -1}},
        {$limit: 3},
    ])

    var topMember = await userquery.exec()

    //get the 4 most recently added event for rendering
    var query = Event.find().limit(4).sort({ $natural: -1 })
    var recEvents = await query.exec()

    //render the homepage with the fetched queries and authetication status
    res.render('home_event', {
        title: 'Home Page',
        recEvents,
        topMember,
        isOrg
    })
};

//rendering dashboard with all the request counts and volunteer status
const dashboard = async function (req, res, next) {
    const userId = req.user._id || req.user.id;
    const { user: { isVolunteer } } = req;

    // query to find weekly upcoming events 6.048e+8 = 7 days
    var query = Event.find({
        "date": {
            $gte: Date.now(),
            $lte: Date.now() + 6.048e+8
        }
    }).limit(5)

    var weekEvent = await query.exec()



    //fetch the counts of requests for display in sidebar and dashboard
    Request.find({ status: 'pending', userId }).exec(function (err, pending) {
        pendingRequestCount = pending.length
        Request.find({ status: 'complete', userId }).exec(function (err, completed) {
            completedEventCount = completed.length
            Request.find({ status: 'accept', userId }).exec(function (err, accepted) {
                acceptedRequestCount = accepted.length
                Request.find({ status: 'reject', userId }).exec(function (err, rejected) {
                    rejectCount = rejected.length;
                    User.findOne({ _id: userId })
                        .then(user => {
                            res.render('dashboard', {
                                title: 'Dashboard',
                                acceptedRequestCount,
                                accepted,
                                pendingRequestCount,
                                completedEventCount,
                                rejectCount,
                                isVolunteer,
                                firstName: req.user.firstName,
                                userId: req.user._id,
                                user: user,
                                weekEvent
                            });
                        })
                });
            });
        });
    });



};

//rendering organization dashboard with counts and organization status
const dashboardadmin = function (req, res, next) {
    const organizationId = req.user._id;
    const { user: { isOrganization } } = req;
    Request.find({ status: 'pending', ownerId: organizationId }).exec(function (err, pending) {
        pendingRequestCount = pending.length
        Request.find({ status: 'complete', ownerId: organizationId }).exec(function (err, complete) {
            completedEventCount = complete.length
            Request.find({ status: 'accept', ownerId: organizationId }).exec(function (err, accepted) {
                acceptedRequestCount = accepted.length
                Request.find({ status: 'reject', ownerId: organizationId }).exec(function (err, rejected) {
                    rejectCount = rejected.length;
                    Event.find({ organizationId }).exec(function (err, events) {
                        eventCount = events.length;
                        res.render('dashboardadmin', {
                            title: 'Dashboard admin',
                            acceptedRequestCount,
                            pendingRequestCount,
                            completedEventCount,
                            rejectCount,
                            eventCount,
                            userName: req.user.name,
                            user: req.user,
                            organizationId,
                            isOrganization
                        });

                    });
                });
            });

        });
    });
};


//renders the form that will be used to add events
const getAddEvent = function (req, res, next) {
    res.render('event_form', {
        title: 'Add event'
    })
};

// creating event keeping record of organization that created the event
const createEvent = function (req, res, next)  {

        const event = new Event({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            type: req.body.type,
            location: req.body.location,
            description: req.body.description,
            date: req.body.date,
            image: req.file.url,
            organizationId: req.user._id

        });

        event.save().then(result => {
            Organization.findOne({
                email: req.user.email
            })
                .then(organization => {
                    organization.events.push(result);
                    organization.save()
                        .then(savedEvent => {
                            res.redirect('/event/' + result._id);
                        })
                        .catch(err => {
                            res.render('error', {
                                title: 'Error'
                            })
                        });
                })
                .catch(err => {
                    res.render('error', {
                        title: 'Error'
                    })
                });
        })
            .catch(err => {
                res.render('error', {
                    title: 'Error'
                })
            });

};

// editing event using the event ID
const editEvent = (req, res, next) => {
    const eventModified = {
        name: req.body.name,
        type: req.body.type,
        location: req.body.location,
        description: req.body.description,
        date: req.body.date,
        image: req.file.url,
    }
    Event.updateOne({ _id: req.params.id, organizationId: req.user.id || req.user._id }, eventModified, function (err, result) {
        if (err) {
            res.render('error', {
                title: 'Error'
            })
        }
        res.redirect('/event/' + req.params.id)
    })
}

// deleting event by IDD
const deleteEvent = (req, res, next) => {
    Event.deleteOne({ _id: req.params.id, organizationId: req.user.id || req.user._id }, function (err, result) {
        if (err) {
            console.log('err', err)
        }
        res.redirect('/event/list')
    })
}

// listing all the event.
// If user account is organization render only the event created by them, or if volunteer list all event

const listEvents = function (req, res, next) {
    //declaring how many events will be displayed in one page
    const perPage = 6;
    var page = req.params.post || 1;


    if (req.isAuthenticated()) {
        const organizationId = req.user.id || req.user._id;
        //for organization you can see all events created by them even though date has passed
        dbUtils.isOrganization(req.user.email)
            .then(isOrganization => {
                if (isOrganization) {
                    Event.find({
                        organizationId,

                    })
                        .skip((perPage * page) - perPage)
                        .limit(perPage)
                        .sort({ date: 'asc' })
                        .then(events => {
                            paginate(events,page,perPage,isOrganization,res)
                        })
                        .catch(err => {
                            res.render('error', {
                                title: 'Error'
                            })
                        })
                } else {
                    //for volunteers only filter out events that has not yet passed
                    Event.find({
                        date: { '$gte': new Date() }
                    })
                        .skip((perPage * page) - perPage)
                        .limit(perPage)
                        .sort({ date: 'asc' })
                        .then(events => {

                            paginate(events,page,perPage,isOrganization,res)

                        })
                        .catch(err => {
                            res.render('error', {
                                title: 'Error'
                            })
                        });
                }
            })
            .catch(err => {
                res.render('error', {
                    title: 'Error'
                })
            });
    } else {
        const message = { type: 'alert-danger', body: 'Your are not logged in' };
        res.render('login', { message });
    }
};

//function used for pagination
const paginate =(events,page,perPage,isOrganization,res)=>{

    return  Event.find({
        date: { '$gte': new Date() }
    })
        .countDocuments() //get total counts of all documents
        .exec(function (err, count) {
            if (err) {
                return res.render('error', {
                    title: 'Error'
                })
            }

            //Determine number of possible pages there will be
            const pages = Math.ceil(count / perPage);
            res.render('all_event', {
                title: 'All Event Page',
                events: events,
                isOrganization,
                current_page: page,
                pages,

            })
        })
}


//search function for event viewing
const getEvent = (req, res, next) => {
    const organizationId = req.user.id || req.user._id;
    dbUtils.isOrganization(req.user.email)
        .then(isOrganisation => {
            if (isOrganisation) {
                // $or allows multiple queries on name and type
                Event.find({ $or: [
                        {'name' : { '$regex' : req.query.search, '$options' : 'i' }},
                        {'type' : { '$regex' : req.query.search, '$options' : 'i' }},
                    ], organizationId }, function(err, result) {
                    if (err) {
                        console.log(err, 'error');
                    }
                    else {
                        res.send({result, isOrganisation});
                    }
                })
            }
            else {
                Event.find( { $or: [
                        {'name' : { '$regex' : req.query.search, '$options' : 'i' }},
                        {'type' : { '$regex' : req.query.search, '$options' : 'i' }}
                    ]}, function(err, result) {
                    if (err) {
                        console.log(err, 'error');
                    }
                    else {
                        res.send({result, isOrganisation});
                    }
                })
            }
        })

}

//Render Selected Event page, event is fetched by ID
//user name, event info, status is sent alongside for display in the template
const findEventById = (req, res) => {
    const { user: { isOrganization } } = req;
    const eventStatus = req.eventStatus ? req.eventStatus : '';
    Event.findOne({ '_id': req.params.id }, (err, event) => {
        const organizationId = req.user._id || req.user.id;
        let name = req.user !== undefined ? req.user.firstName : '';
        name = (name) ? name : '';
        if (err) {
            res.sendStatus(500);
        } else {
            res.render('selected_event', {
                title: 'Event Page',
                event,
                organizationId,
                name,
                eventStatus,
                isOrganization

            })
        }
    });
};

//Render Edit Event Page
const getEditEvent = (req, res) => {
    Event.findOne({ '_id': req.params.id }, (err, event) => {
        const organizationId = req.user.id || req.user._id;
        if (err) {
            res.sendStatus(500);
        } else {
            res.render('edit_event', {
                event,
                organizationId
            })
        }
    });
};


//render login with error message using flash middleware
const getLogin = function (req, res, next) {
    var error = req.flash('error');
    res.render('login', {
        title: 'Login',
        message: error

    })
};



//render signup option (selecting whether organization of user)
const getSignup = function (req, res, next) {
    res.render('sign_option', {
        title: 'Sign up Option'
    })
};

//render volunteer signup page
const getUserSignup = function (req, res, next) {
    res.render('signupuser', {
        title: 'Sign up as a User'
    })
};

//render organization signup page
const getOrganizationSignup = function (req, res, next) {
    res.render('signuporganization', {
        title: 'Sign up as an Organization'
    })
};

//Volunteer signup function useing hash for password
const userSignup = function (req, res, next) {

    // Check if there's error with the input supplied by the user.
    // if there is, render the page with the error

    const errors = req.validationErrors();

    if (errors) {
        return res.render('signupuser', { errors });
    }

     //Check if a user with that email is existing before adding them to prevent duplicates

    User.findOne({
        email: {
            "$regex": "^" + req.body.email + "\\b", "$options": "i"
        }
    }).then((user) => {
        if (user) {
            const message = { type: 'alert-danger', body: 'A user with this email address already exist' }
            return res.render('login', { message })
        }
        else {
            //bcrypt is used to ensure security/database owner cannot see the password info
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8),
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                bio: req.body.bio,
                experience: req.body.experience
            });


            //If all good, save it in database and display success message
            user.save()
                .then(result => {
                    const message = { type: 'alert-success', body: 'Your account has been created successfully, Please login' };
                    return res.render('login', { message })
                })
                .catch(err => {
                    res.render('error', {
                        title: 'Error'
                    })
                });
        }
    });
};

//function for organization signup
const organizationSignup = function (req, res, next) {
    const errors = req.validationErrors();

    //Check if there's error with the input supplied by the user

    if (errors) {
        return res.render('signuporganization', { errors });
    }

    //Check if a user with that email is existing before adding them to prevent duplicates

    Organization.findOne({
        email: {
            "$regex": "^" + req.body.email + "\\b", "$options": "i"
        }
    }).then((organization) => {
        if (organization) {
            const message = { type: 'alert-danger', body: 'An organization with this email address already exist' }
            return res.render('login', { message })
        }


        else {
            const organization = new Organization({
                name: req.body.name,
                abbreviation: req.body.lastName,
                estYear: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
            });

            organization.save()
                .then(result => {
                    const message = { type: 'alert-success', body: 'Your account has been created successfully, Please login' };
                    return res.render('login', { message })
                })
                .catch(err => {
                    res.render('error', {
                        title: 'Error'
                    })
                });
        }
    });
};



//login function displaying appropriate error messages
// and redirecting user to either dashboard admin or dashboard based on their account type
const login = (req, res, next) => {
    dbUtils.isOrganization(req.body.email)
        .then(isOrganization => {
            if (isOrganization) {
                Organization.findOne({
                    email: req.body.email
                })
                    .then(organization => {
                        if (
                            organization &&
                            bcrypt.compareSync(req.body.password, organization.password
                            )) {
                            return passport.authenticate('local', function (err) {

                                if (err) { return next(err); }
                                return req.logIn(organization, function (err) {
                                    if (err) { return next(err); }
                                    return res.redirect('/dashboardadmin');
                                });
                            })(req, res, next)
                        } else {
                            const message = {
                                type: 'alert-danger',
                                body: 'User or password does not match'
                            }
                            return res.render('login', { message })
                        }

                    }).catch(err => {
                        const message = {
                            type: 'alert-danger',
                            body: 'Please Try Again With Valid Credential'
                        }
                        return res.render('login', { message })
                    });

            } else {
                User.findOne({
                    email: req.body.email
                })
                    .then(user => {
                        if (user) {
                            if (bcrypt.compareSync(req.body.password, user.password)) {
                                return passport.authenticate('local', function (err) {

                                    if (err) { return next(err); }
                                    return req.logIn(user, function (err) {
                                        if (err) { return next(err); }
                                        let message;
                                        if (!user.firstName) {
                                            message = { type: 'alert-warning', body: 'Your profile details are missing. Please update your profile' };
                                        }
                                        return res.redirect('/dashboard');
                                    });
                                })(req, res, next);
                            } else {
                                const message = {
                                    type: 'alert-danger',
                                    body: 'User or password does not match'
                                }
                                return res.render('login', { message })
                            }
                        } else {
                            const message = {
                                type: 'alert-danger',
                                body: 'User or password does not match'
                            }
                            return res.render('login', { message })
                        }

                    }).catch(err => {
                        const message = {
                            type: 'alert-danger',
                            body: 'Please Try Again With Valid Credential'
                        }
                        return res.render('login', { message })
                    });
            }
        }).catch(err => {
            console.log('err :', err);
            res.render('login', {
                title: 'Error'
            })
        });

}


//function to render about us page
// still needs to check whether it's organization account because of dashboard redirection in navbar
const getAbout = function (req, res, next) {
    var isOrg = false;
    if (req.isAuthenticated()){
        const { user: { isOrganization } } = req;
        isOrg = isOrganization
    }

    res.render('about', {
        title: 'About us',
        isOrg
    })
};

//function to render contact us page
const getContact = function (req, res, next) {
    var isOrg = false;
    if (req.isAuthenticated()){
        const { user: { isOrganization } } = req;
        isOrg = isOrganization
    }
    res.render('contact', {
        title: 'Contact us',
        isOrg
    })
};




module.exports.homePageEvent = homePageEvent;
module.exports.dashboard = dashboard;
module.exports.dashboardadmin = dashboardadmin;

module.exports.createEvent = createEvent;
module.exports.listEvents = listEvents;
module.exports.getAddEvent = getAddEvent;
module.exports.findEventById = findEventById;
module.exports.getEvent = getEvent;

module.exports.getSignup = getSignup;
module.exports.getUserSignup = getUserSignup;
module.exports.getOrganizationSignup = getOrganizationSignup;
module.exports.userSignup = userSignup;
module.exports.organizationSignup = organizationSignup;

module.exports.getLogin = getLogin;
module.exports.login = login;
module.exports.editEvent = editEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.getEditEvent = getEditEvent;

module.exports.getAbout = getAbout;
module.exports.getContact = getContact;