'use strict';

const cheerio = require('cheerio');
const request = require('request');
const Rx = require('rx-lite');

const Package = require('../package.json');

class Scraper {
  constructor(logger) {
    this.logger = logger;
    this.request = request.defaults({
      headers: { 'User-Agent': 'kzt v' + Package.version },
      gzip: true
    });
  }

  getRates() {
    return this
      ._getBody()
      .map(body => cheerio.load(body))
      .map($ => $('.container[role="main"] > .row > div > table').get()
        .map(sourceNode => ({
          title: $(sourceNode).find('thead th').text(),
          rates: $(sourceNode).find('tbody > tr').get()
            .map(rateNode => {
              const columns = $(rateNode)
                .children().get()
                .map(columnNode => $(columnNode).text().trim());

              let rate = { currency: columns[0] };
              if (columns[1]) {
                const key = columns.length === 2 ? 'weighted' : 'buy';
                const price = this.constructor._extractRate(columns[1]);
                if (price) {
                  rate[key] = parseFloat(price);
                }
              }
              if (columns[2]) {
                const sell = this.constructor._extractRate(columns[2]);
                if (sell) {
                  rate.sell = parseFloat(sell);
                }
              }

              return rate;
            })
        }))
        .filter(source => {
          return !!source.title && !!source.rates && source.rates.length > 0;
        }));
  }

  _getBody() {
    let errorCount = 0;

    return Rx.Observable
      .fromNodeCallback(this.request)('https://xn--80aae1b9a9d.kz')
      .map(result => ({ response: result[0], body: result[1] }))
      .flatMap(result => {
        if (result.response.statusCode !== 200) {
          return Rx.Observable
            .throw(new Error(`Status code ${result.response.statusCode}`));
        } else {
          return Rx.Observable.return(result.body);
        }
      })
      .catch(err => {
        errorCount++;

        const delay = Math.round(Math.pow(errorCount, 1.5)) * 1000;

        this.logger.warning('Failed to get the rates. ' +
          `Retrying in ${delay / 1000} seconds`);

        return Rx.Observable
          .empty()
          .delay(delay)
          .concat(Rx.Observable.throw(err));
      })
      .retry(3);
  }

  static _extractRate(str) {
    return (str
      .replace(/,/g, '.')
      .match(/^(\d+\.\d+).*/) || [])[1];
  }
}

module.exports = Scraper;
