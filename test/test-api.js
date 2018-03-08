const chai = require('chai');

const expect = chai.expect;

const { getCoins, getAllCoins } = require('../api');

describe('api function', () => {
  it('should run function and get coin', () =>
    getCoins('litecoin').then(res => {
      expect(res[0].name).to.equal('Litecoin');
    }));
});

describe('#getAllCoins', () => {
  it('should return all coins information combined with coin symbol', () =>
    getAllCoins(['litecoin', 'bitcoin']).then(res => {
      expect(res[0].name).to.equal('Litecoin');
      expect(res[1].name).to.equal('Bitcoin');
    }));
});
