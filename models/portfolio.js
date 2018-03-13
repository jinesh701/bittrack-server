const mongoose = require('mongoose');
const { getCoins } = require('../api');

const cryptoPortfolioSchema = mongoose.Schema({
  id: String,
  holdings: Number
});

const CryptoPortfolio = mongoose.model('Portfolio', cryptoPortfolioSchema);


const getFullCryptoPortfolio = () =>
  CryptoPortfolio.find()
    .then(portfolios =>
      Promise.all(portfolios.map(portfolio => getCoins(portfolio.id).then(item =>
        Object.assign({}, ...item, {
          0: portfolio.holdings
        })))));

module.exports = { CryptoPortfolio, getFullCryptoPortfolio };
