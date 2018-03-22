const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const cryptoPortfolioSchema = mongoose.Schema({
  id: String,
  holdings: Number,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const CryptoPortfolio = mongoose.model('Portfolio', cryptoPortfolioSchema);


module.exports = { CryptoPortfolio };
