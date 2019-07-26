const mongoose = require('mongoose')

const connect = () => {
  mongoose.connect(process.env.MONGO_URI +'/test?retryWrites=true&w=majority', { useNewUrlParser: true }).catch(err => console.log(err));
};


const userSchema = mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  route: Number
});


module.exports = {
  connect: connect
};