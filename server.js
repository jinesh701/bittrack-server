// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const watchlist = require('./router/watchlist');

// MongoDB
const db = mongoose.connect('mongodb://localhost/bittrack');

// Express
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors
app.use(cors());

// Logging
app.use(morgan('common'));

// Cookie Parser
app.use(cookieParser());

// Router
app.use('/api', watchlist);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

app.post('/login', (req, res) => {
  let createId = function() {
    return (
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  };

  if (!req.cookies.user) {
    res.cookie('user', createId()).end();
  } else {
    res.end();
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };
