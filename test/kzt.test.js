'use strict';

const expect = require('chai').expect;

const Scraper = require('../src/scraper');

let scraper;

describe('KKB Scraper', () => {
  before(() => {
    let logger = {};
    logger.warning = function() {};
    logger.error = function() {};

    scraper = new Scraper(logger);
  });

  it('retrives rates from the page', done => {
    scraper.getRates().subscribe(rates => {
      expect(rates).to.be.an('array');
      expect(rates).to.not.be.empty;
      for (let i = 0; i < rates.length; i++) {
        const rate = rates[i];

        expect(rate).to.have.property('currency').that.is.a('string');
        expect(rate).to.have.property('buy').that.is.a('number');
        expect(rate).to.have.property('sell').that.is.a('number');
      }

      done();
    }, done);
  });
});
