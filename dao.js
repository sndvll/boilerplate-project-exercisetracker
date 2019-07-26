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

const createUser = async (username) => {
  let json;
  await User.findOne({username: username}, async (err, res) => {
    if (err) json = {...errors.general};
    if (res) json = {...errors.usernameTaken};
    await User.create({username: username, _id: shortid.generate()}, async (err, res) => {
      if (err) json = {...errors.general};
      console.log(res);
      await json = { username: res.username, _id: res._id };
    });
  })
  return json;
};

module.exports = {
  connect,
  createUser
};