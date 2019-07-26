const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const dao = require('./dao.js');
dao.connect();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Routehandlers
const newUserHandler = (req, res) => {
  dao.createUser(req.body.username).then(user => res.json(user));
};
const newExcerciseHandler = (req, res) => {};
const getHandler = (req, res) => {};


// Routes
app.post('/api/exercise/new-user', newUserHandler);
app.post('/api/exercise/add', newExcerciseHandler);
app.get('/api/exercise/log', getHandler);

// Not found middleware
app.use((req, res, next) => next({status: 404, message: 'not found'}));

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
});

app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
