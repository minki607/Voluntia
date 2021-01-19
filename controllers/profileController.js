//profile controller function on dashboard to update user information

const Organisation = require('../models/organization');
const User = require('../models/user');

const updateUserProfile = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.bio = req.body.bio;
  user.experience = req.body.experience
  await user.save()
  res.redirect('/dashboard')
}

const updateOrganisationProfile = async (req, res, next) => {
  const organisationId = req.params.id;
  const organisation = await Organisation.findOne({ _id: organisationId });
  organisation.name = req.body.name;
  organisation.estYear = req.body.estYear;
  organisation.type = req.body.type;
  await organisation.save();
  res.redirect('/dashboardadmin')
}

module.exports = { updateOrganisationProfile, updateUserProfile };