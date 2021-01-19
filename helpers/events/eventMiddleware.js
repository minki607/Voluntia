//middleware for event request handling

const Request = require('../../models/request');

const eventMiddleware = {
  isBooked: (req, res, next) => {
    if(req.isAuthenticated()) {
      const userId = req.user.id || req.user._id;
    Request.find({eventId: req.params.id, userId}).then((request) => {
      if(request.length > 0) {
        req.eventStatus = request[0].status;
        return next()
      }
      return next();
    })
    .catch(err => {
      console.log('err :', err);
        res.render('error', {
            title: 'Error'
        })
    });
  } else {
    const message = { type: 'alert-danger', body: 'Your are not logged in'};
    res.render('login', {message});
  }

}
}

module.exports = eventMiddleware;