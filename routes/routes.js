const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const { ensureAuthenticatedAsUser, ensureAuthenticatedAsOrganization } = require('../config/auth');
const { validateUserSignUp, validateUserLogin, validateOrganizationSignUp } = require('../helpers/validations/validate');
const {bookEvents, pendingRequests,bookedRequests,pendingRequestInfo, requestResponse, fectchCompletedEvents, fectchConfirmedEvents, fectchRejectedEvents,
    fectchCompletedEventsOrganization, fectchConfirmedEventsOrganization, fectchRejectedEventsOrganization } = require('../controllers/eventsController');
const { updateOrganisationProfile, updateUserProfile } = require('../controllers/profileController');
const { isBooked } = require('../helpers/events/eventMiddleware');
const { parser } = require('../config/uploadConfig')

router.get('/', controller.homePageEvent);
router.get('/dashboard', ensureAuthenticatedAsUser, controller.dashboard);
router.get('/dashboardadmin', ensureAuthenticatedAsOrganization, controller.dashboardadmin);

// Events
router.get('/event/list/:post?', controller.listEvents);
router.get('/event/add', ensureAuthenticatedAsOrganization, controller.getAddEvent);
router.post('/event/add', ensureAuthenticatedAsOrganization,parser.single('image'), controller.createEvent);

router.get('/event/:id', isBooked, controller.findEventById);
router.post('/event/booking', ensureAuthenticatedAsUser, bookEvents)
router.get('/pending/requests', ensureAuthenticatedAsUser, pendingRequests)
router.get('/booked/requests', ensureAuthenticatedAsOrganization, bookedRequests);
router.get('/request/:id/:userId', pendingRequestInfo)
router.post('/requests/:id', ensureAuthenticatedAsOrganization, requestResponse)
router.get('/request/accepted', ensureAuthenticatedAsUser, fectchConfirmedEvents)
router.get('/request/completed', ensureAuthenticatedAsUser, fectchCompletedEvents)
router.get('/request/rejected', ensureAuthenticatedAsUser, fectchRejectedEvents)
router.get('/event/accepted/organization', ensureAuthenticatedAsOrganization, fectchConfirmedEventsOrganization)
router.get('/event/completed/organization', ensureAuthenticatedAsOrganization, fectchCompletedEventsOrganization)
router.get('/event/rejected/organization', ensureAuthenticatedAsOrganization, fectchRejectedEventsOrganization)

router.get('/edit/event/:id', ensureAuthenticatedAsOrganization, controller.getEditEvent);
router.post('/edit/event/:id', ensureAuthenticatedAsOrganization, parser.single('image'), controller.editEvent);
router.post('/delete/event/:id', ensureAuthenticatedAsOrganization, controller.deleteEvent);
// Signup
router.get('/signup', controller.getSignup);

router.get('/volunteer/signup', controller.getUserSignup);
router.post('/volunteer/signup', validateUserSignUp, controller.userSignup);

router.get('/organization/signup', controller.getOrganizationSignup);
router.post('/organization/signup', validateOrganizationSignUp, controller.organizationSignup);

// Login
router.get('/login', controller.getLogin);
router.post('/login', validateUserLogin, controller.login);

//Search
router.get('/search', controller.getEvent)

// Profile
router.post('/users/:id/update', updateUserProfile);
router.post('/organisations/:id/update', updateOrganisationProfile);

router.get('/about',  controller.getAbout);
router.get('/contact',  controller.getContact);

// Logout and destory current session
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});




module.exports = router;