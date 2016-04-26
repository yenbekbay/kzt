'use strict';

const cheerio = require('cheerio');
const request = require('request');
const Rx = require('rx-lite');

const Logger = require('./logger');
const Package = require('../package.json');

const KKB_EXCHANGE_RATES_URL = 'http://ru.kkb.kz/page/RatesConverting';

class Scraper {
  constructor(logger) {
    this.logger = logger;
  }

  getRates() {
    return this
      .loadUrl(KKB_EXCHANGE_RATES_URL)
      .map(body => cheerio.load(body))
      .map($ => $('.tbl_text2')
        .first().children()
        .last().children()
        .get()
        .map(rate => {
          let currency = $(rate).children().first().children().first().text();
          if (currency.indexOf('KZT') > -1) {
            return {
              currency: currency.substring(0, 3),
              buy: parseFloat($(rate).children().first().next().text()),
              sell: parseFloat($(rate).children().last().text())
            };
          } else {
            return;
          }
        })
        .filter(rate => rate !== undefined));
  }

  loadUrl(url) {
    const self = this;

    const options = {
      url: url,
      headers: {
        'User-Agent': 'kzt v' + Package.version
      },
      gzip: true,
      encoding: null
    };

    const observable = Rx.Observable.create(observer => {
      request(options, (err, response, body) => {
        if (!err && response.statusCode === 200) {
          observer.onNext(body);
          observer.onCompleted();
        } else if (err) {
          observer.onError(err);
        } else {
          observer.onError(Error('Status code ' + response.statusCode));
        }
      });
    });

    let errorCount = 0;

    return observable
      .catch(err => {
        errorCount++;

        const delay = Math.round(Math.pow(errorCount, 1.5)) * 1000;

        self.logger.warning('Failed to load ' + url + '. Retrying in ' +
          delay / 1000 + ' seconds');

        return Rx.Observable
          .empty()
          .delay(delay)
          .concat(Rx.Observable.throw(err));
      })
      .retry(3);
  }
}

module.exports = Scraper;
