// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, DATABASE_URL } = require('./config');
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

// Catch-all for non-existent endpoints
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Server
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
