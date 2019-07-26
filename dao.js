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

const createUser = (username, done) => {
  User.findOne({username: username}, (err, res) => {
    if (err) done({...errors.general});
    else if (res) done({...errors.usernameTaken});
    else {
      User.create({username: username, _id: shortid.generate()}, (err, res) => {
        if (err) done({...errors.general});
        done(null,{ username: res.username, _id: res._id });
      });
    }
  });
};


module.exports = {
  connect,
  createUser
};