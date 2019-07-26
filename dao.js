const mongoose = require('mongoose');
const shortid = require('shortid');

const errors = {
  general: { error: 'Something wnt south...' },
  userNotFound: { error: 'No user with that username found' },
  usernameTaken: { error: 'Username allready taken' }
};

const connect = () => {
  mongoose.connect(process.env.MONGO_URI +'/test?retryWrites=true&w=majority', { useNewUrlParser: true }).catch(err => console.log(err));
};

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  _id: { type: String, required: true }
});

const User = mongoose.model('excerciseUser', userSchema);

const createUser = (username) => {
  return User.findOne({username}, (err, res) => {
    if (err) return errors.general;
    if (res) return errors.usernameTaken;
    return User.create({username, _id: shortid.generate()}, (err, res) => {
      if (err) return errors.general;
      console.log(res);
      return { username: res.username, _id: res._id };
    });
  })
};

module.exports = {
  connect,
  createUser
};