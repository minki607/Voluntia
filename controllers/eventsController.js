const Request = require('../models/request');
const User = require('../models/user')


//controller method relating to events requests
//At this point,instead of using dbutill isOrganization, additional field is created in schema

const events = {

  //Create a new booking request
  bookEvents: (req, res, next) => {
    const request = new Request({
      userName: req.body.username,
      userId: req.body.userId,
      status: req.body.status,
      reasons: req.body.reasons,
      event: JSON.parse(req.body.event),
      eventId: req.body.eventId,
      ownerId: req.body.ownerId
    });
    request.save();
    res.redirect('/dashboard');
  },

  //check for each status and render the page accordingly,
  pendingRequests: (req, res, next) => {
    Request.find({ userId: req.user.id || req.user._id, status: 'pending' }).then((requests => {
      const currentUser = req.user.id || req.user._id;
      const { user: { isVolunteer } } = req;

      res.render('pending_request', { title: 'Pending Requests', requests, currentUser, isVolunteer})
    }))
  },

  bookedRequests: (req, res, next) => {
    const currentUser = req.user.id || req.user._id;
    const { user: { isVolunteer } } = req;
    const { user: { isOrganization } } = req;
    Request.find({ ownerId: currentUser, status: 'pending' }).then((requests => {
      res.render('pending_request', { title: 'Booked Requests', requests, currentUser, isVolunteer, isOrganization})
    }))
  },

  pendingRequestInfo: async (req, res, next) => {
    const userId = req.user.id || req.user._id;
    const requesterId = req.params.userId
    const { user: { isVolunteer } } = req;
    const request = await Request.findOne({ eventId: req.params.id, userId: req.params.userId });
    const user = await User.findOne({ _id: requesterId});

    res.render('approve_request', { request, userId, isVolunteer, user});
  },

  requestResponse: (req, res, next) => {
    const { body: { reasons } } = req;

    Request.updateOne(
      { _id: req.params.id },
      { status: req.body.status, reasons },
    )
      .then(request => {
        if (request !== null) {
        }
        res.redirect('/dashboardadmin');
      })
      .catch(e => {
        console.log('e :', e);
      })
  },

  fectchConfirmedEvents: (req, res, next) => {
    const { user: { isVolunteer } } = req;
    Request.find({ userId: req.user.id || req.user._id, status: 'accept' })
      .then(requests => {
        res.render('pending_request', { title: 'Accepted Requests', requests, isVolunteer })
      })
  },

  fectchCompletedEvents: (req, res, next) => {
    const { user: { isVolunteer } } = req;
    Request.find({ userId: req.user.id || req.user._id, status: 'complete' })
      .then(requests => {
        res.render('pending_request', { title: 'Completed Requests',requests, isVolunteer })
      })
  },

  fectchRejectedEvents: (req, res, next) => {
    const { user: { isVolunteer } } = req;
    Request.find({ userId: req.user.id || req.user._id, status: 'reject' })
      .then(requests => {
        res.render('pending_request', { title: 'Rejected Requests', requests, isVolunteer })
      })
  },

  fectchConfirmedEventsOrganization: (req, res, next) => {
    const { user: { isOrganization } } = req;
    Request.find({ ownerId: req.user.id || req.user._id, status: 'accept' })
      .then(requests => {
        res.render('pending_request', { title: 'Accepted Requests', requests, isOrganization })
      })
  },

  fectchCompletedEventsOrganization: (req, res, next) => {
    const { user: { isOrganization } } = req;
    Request.find({ ownerId: req.user.id || req.user._id, status: 'complete' })
      .then(requests => {
        res.render('pending_request', { title: 'Completed Requests', requests, isOrganization })
      })
  },

  fectchRejectedEventsOrganization: (req, res, next) => {
    const { user: { isOrganization } } = req;
    Request.find({ ownerId: req.user.id || req.user._id, status: 'reject' })
      .then(requests => {
        res.render('pending_request', { title: 'Rejected Requests', requests, isOrganization })
      })
  },
}

module.exports = events;