/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

'use strict';

const express = require('express');

const router = express.Router();
const { CryptoPortfolio } = require('./models');
const { getCoins } = require('../api');

// GET
router.get('/', (req, res) => {
  CryptoPortfolio.find({ _creator: req.user._id })
    .sort({ holdings: 'desc' })
    .then(portfolios =>
      Promise.all(portfolios.map(portfolio => getCoins(portfolio.id).then(item =>
        Object.assign({}, ...item, {
          holdings: portfolio.holdings
        })))))
    .then(res.json.bind(res))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// POST
router.post('/:id', (req, res) => {
  const id = req.params.id;
  const { holdings } = req.body;


  CryptoPortfolio.findOne({ _creator: req.user._id, id }, (err, existingCoin) => {
    if (existingCoin === null) {
      getCoins(id)
        .then(x => x[0])
        .then(value =>
          CryptoPortfolio.create({
            id: value.id,
            holdings,
            _creator: req.user._id
          }).then(() => value))
        .then(newItem => {
          res.status(201).json(newItem);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        });
    }
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  CryptoPortfolio.findOneAndRemove({ _creator: req.user._id, id })
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        res.json('Item does not exist in watchlist');
      }
    });
});

module.exports = { router };
