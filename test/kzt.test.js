var expect = require('chai').expect;
var scraper = require('../lib/scraper');

describe('KKB Scraper', function() {
  it('retrives rates from the page', function(done) {
    scraper.getRates().subscribe(function(rates) {
      expect(rates).to.be.an('array');
      expect(rates).to.not.be.empty;
      for (var i = 0; i < rates.length; i++) {
        var rate = rates[i];
        expect(rate).to.have.property('currency').that.is.a('string');
        expect(rate).to.have.property('buy').that.is.a('number');
        expect(rate).to.have.property('sell').that.is.a('number');
      }
      done();
    }, done);
  });
});
