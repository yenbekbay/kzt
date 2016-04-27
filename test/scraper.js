'use strict';

const Lab = require('lab');
const expect = require('code').expect;

const Scraper = require('../src/scraper');

const lab = exports.lab = Lab.script();

class MockLogger {
  startSpinner() {}
  stopSpinner() {}
  log() {}
  error() {}
  warn() {}
}

lab.describe('scraper', () => {
  let scraper;

  lab.before(done => {
    scraper = new Scraper(new MockLogger());
    done();
  });

  lab.it('retrieves rates', done => {
    scraper
      .getRates()
      .subscribe(sourceRates => {
        expect(sourceRates).to.be.an.array();

        sourceRates.forEach(sourceRate => {
          expect(sourceRate).to.include(['title', 'rates']);
          sourceRate.rates.forEach(currencyRate => {
            if (['KASE', 'Нацбанк'].indexOf(sourceRate.title) > -1) {
              expect(currencyRate).to.include(['currency', 'weighted']);
            } else {
              expect(currencyRate).to.include(['currency', 'buy', 'sell']);
            }

            Object.keys(currencyRate)
              .filter(key => key !== 'currency')
              .forEach(key => expect(currencyRate[key]).to.be.a.number());
          });
        });

        done();
      }, done);
  });
});
