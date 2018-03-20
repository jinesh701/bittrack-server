const express = require('express');

const router = express.Router();
const { CryptoPortfolio, getFullCryptoPortfolio } = require('../models/portfolio');
const { getCoins } = require('../api');

// GET
router.get('/', (req, res) => {
  getFullCryptoPortfolio()
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

  CryptoPortfolio.findOne({ id }, (err, existingCoin) => {
    if (existingCoin === null) {
      getCoins(id)
        .then(x => x[0])
        .then(value =>
          CryptoPortfolio.create({
            id: value.id,
            holdings
          }).then(() => value))
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
});

// DELETE
router.delete('/:id', (req, res) => {
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

module.exports = { router };
