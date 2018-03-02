/* eslint-env mocha */

const chai = require('chai');

const expect = chai.expect;

const getCoins = require('../api');

describe('api function', () => {
  it('should run function and get coin', () => {
    return getCoins('litecoin').then(res => {
      expect(res[0].name).to.equal('Litecoin');
    });
  });
});
