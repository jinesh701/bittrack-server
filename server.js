/* eslint func-names: ["error", "as-needed"], no-shadow: ["error", { "allow": ["err"] }] */

'use strict';

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, DATABASE_URL } = require('./config');
const { CLIENT_ORIGIN } = require('./config');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: watchlistRouter } = require('./watchlist');
const { router: portfolioRouter } = require('./portfolio');

mongoose.Promise = global.Promise;

// Express
const app = express();

// Logging
app.use(morgan('common'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors
app.use(cors({
  origin: CLIENT_ORIGIN
}));

// Passport
passport.use(localStrategy);
passport.use(jwtStrategy);

// Router
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/watchlist/', watchlistRouter);
app.use('/api/portfolio/', portfolioRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => res.json({
  data: 'rosebud'
}));

app.get('/api', (req, res) => {
  res.send('Welcome to my API!');
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
  return mongoose.disconnect().then(() =>
    new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    }));
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
