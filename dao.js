const mongoose = require('mongoose')

const errors = {
  general: { error: 'Something wnt south...' },
  userNotFound: { error: 'No user with that username found' },
  usernameTaken: {}
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
  User.findOne({username}, (err, res) => {
    if (err) return errors.general;
    if (res) return
  })
};

module.exports = {
  connect: connect
};