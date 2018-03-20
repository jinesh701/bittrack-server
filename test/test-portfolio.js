/* eslint-disable no-unused-expressions  */

const chai = require('chai');
const mongoose = require('mongoose');

const expect = chai.expect;

const { CryptoPortfolio, getFullCryptoPortfolio } = require('../portfolio');
const { TEST_DATABASE_URL } = require('../config');

before(() => mongoose.connect(TEST_DATABASE_URL));

after(() => mongoose.disconnect());

describe('getFullCryptoPortfolio function', () => {
  it('retrieves updated coin information and includes holdings', () =>
    CryptoPortfolio.create({ id: 'bitcoin', holdings: 1 })
      .then(item => getFullCryptoPortfolio().then(portfolios => {
        expect(portfolios[0].name).to.equal('Bitcoin');
        expect(portfolios[0].symbol).to.equal('BTC');
      })));
});

