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


// Schemas
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  _id: { type: String, required: true },
  log: []
});

// Models
const User = mongoose.model('exerciseusers', userSchema);

// Operations
const createUser = (username, done) => {
  User.findOne({username: username}, (err, user) => {
    if (err) done({...errors.general});
    else if (user) done({...errors.usernameTaken});
    else {
      User.create({username: username, _id: shortid.generate()}, (err, user) => {
        if (err) done({...errors.general});
        done({ username: user.username, _id: user._id });
      });
    }
  });
};
const addExercise = (payload, done) => {
  console.log(payload);
  const log = {
    description: payload.description,
    duration: payload.duration,
    date: new Date(payload.date)
  };
  User.findById({_id: payload.userId}, (err, user) => {
    if (err) done({...errors.general});
    user.log.push(log);
    user.save((err, user) => err ? done(err) : done({...log, date: log.date.toUTCString(), _id: user._id, username: user.username}));
  })
};

const findLog = (userId, from, to, limit) => {
  
}

module.exports = {
  connect,
  createUser,
  addExercise
};