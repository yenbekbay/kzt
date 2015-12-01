var cheerio = require('cheerio');
var logger = require('./logger');
var request = require('request');
var Rx = require('rx-lite');

const KKB_EXCHANGE_RATES_URL = 'http://ru.kkb.kz/page/RatesConverting';

function getRates() {
  return Rx.Observable.create(function(observer) {
    loadUrl(KKB_EXCHANGE_RATES_URL).subscribe(function(body) {
      var $ = cheerio.load(body);
      observer.onNext($('.tbl_text2').first().children().last().children().get()
        .map(function(rate) {
        var currency = $(rate).children().first().children().first().text();
        if (currency.indexOf('KZT') > -1) {
          return {
            currency: currency.substring(0, 3),
            buy: parseFloat($(rate).children().first().next().text()),
            sell: parseFloat($(rate).children().last().text())
          };
        } else {
          return;
        }
      }).filter(function(rate) {
        return rate !== undefined;
      }));
      observer.onCompleted();
    }, function(err) {
      observer.onError(err);
    });
  });
}

function loadUrl(url) {
  var options = {
    url: url,
    gzip: true,
    encoding: null
  };
  var errorCount = 0;
  return Rx.Observable.create(function(observer) {
    request(options, function(err, response, body) {
      if (!err && response.statusCode === 200) {
        observer.onNext(body);
        observer.onCompleted();
      } else if (err) {
        observer.onError(new Error(options.url + ' can\'t be reached: ' +
          err.message));
      } else {
        observer.onError(new Error(options.url + ' can\'t be reached: ' +
          'Status code ' + response.statusCode));
      }
    });
  }).catch(function(err) {
    errorCount++;
    var delay = Math.round(Math.pow(errorCount, 1.6)) * 1000;
    logger.warning('Failed to make a connection. Retrying in ' + delay / 1000 +
      ' seconds');
    return Rx.Observable.empty().delay(delay)
      .concat(Rx.Observable.throw(err));
  }).retry(3);
}

module.exports.getRates = getRates;
module.exports.loadUrl = loadUrl;
