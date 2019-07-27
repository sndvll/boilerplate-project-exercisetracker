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
  User.findOne({username: username})
    .then(user => {
      if (user) done({...errors.usernameTaken});
      else {
        User.create({username: username, _id: shortid.generate()})
          .then(user => {
            done({ username: user.username, _id: user._id });
          })
          .catch(err => done({...errors.general}));
      }
    })
    .catch(err => done({...errors.general}));
};

const addExercise = (payload, done) => {
  const log = {
    description: payload.description,
    duration: payload.duration,
    date: new Date(payload.date)
  };
  User.findById({ _id: payload.userId })
    .then(user => {
      user.log.push(log);
      user.save((err, user) => err ? done(err) : done({...log, date: log.date.toUTCString(), _id: user._id, username: user.username}));
    })
    .catch(err => done({ ...errors.general }));
};

const findLog = (userId, from, to, limit, done) => {
   User.findById({_ud:userId })
     .then(user => {
       console.log(user);
     })
     .catch(err => done({...errors.general}));
}

module.exports = {
  connect,
  createUser,
  addExercise
};