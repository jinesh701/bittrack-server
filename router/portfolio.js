const express = require('express');

const router = express.Router();
const { CryptoPortfolio, getFullCryptoPortfolio } = require('../models/portfolio');
const { getCoins } = require('../api');

// GET
router.get('/portfolio', (req, res) => {
  getFullCryptoPortfolio()
    .then(res.json.bind(res))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// POST
router.post('/portfolio/:id', (req, res) => {
  const id = req.params.id;
  const { holdings } = req.body;
  const userCookie = req.cookies.user;

  if (userCookie !== undefined) {
    CryptoPortfolio.findOne({ id }, (err, existingCoin) => {
      if (existingCoin === null) {
        getCoins(id)
          .then(x => x[0])
          .then(value =>
            CryptoPortfolio.create({
              id: value.id,
              holdings
            }))
          .then(newItem => {
            res.status(201).json(newItem);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
          });
      } else {
        const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
        res.json(`${capitalizedId} already in watchlist`);
      }
    });
  } else {
    res.end('Please login');
  }
});

// DELETE
router.delete('/portfolio/:id', (req, res) => {
  const id = req.params.id;

  CryptoPortfolio.findOneAndRemove({ id })
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        res.json('Item does not exist in watchlist');
      }
    });
});

module.exports = router;
