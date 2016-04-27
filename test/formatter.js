'use strict';

const Lab = require('lab');
const expect = require('code').expect;
const Chance = require('chance');

const Formatter = require('../src/formatter');
const chance = new Chance();

const lab = exports.lab = Lab.script();

const currencies = ['USD', 'EUR', 'RUB'];
const buySellSources = [
  'Asia Credit',
  'Альфа-банк',
  'Казком',
  'Казпочта',
  'МиГ',
  'Сбербанк',
  'Халык банк'
];
const weightedSources = [
  'KASE',
  'Нацбанк'
];
const generateRates = type => {
  const sources = type === 'buy-sell' ? buySellSources : weightedSources;
  return sources.map(source => ({
    title: source,
    rates: currencies.map(currency => {
      const price = currency === 'RUB'
        ? chance.floating({ fixed: 3, min: 4.8, max: 5.2 })
        : chance.floating({ fixed: 3, min: 300, max: 400 });
      const rate = { currency: currency };
      if (type === 'buy-sell') {
        rate.buy = price;
        rate.sell = price + (currency === 'RUB'
          ? chance.floating({ fixed: 3, min: 1, max: 4 })
          : chance.floating({ fixed: 3, min: 0.05, max: 0.2 }));
      } else {
        rate.weighted = price;
      }

      return rate;
    })
  }));
};
const rates = generateRates('buy-sell').concat(generateRates('weighted'));

lab.describe('formatter', () => {
  lab.it('formats all sources for all currencies', done => {
    const formatter = new Formatter(rates, currencies);
    const tables = formatter.tablesForAllSources();
    expect(tables.length).to.be
      .equal(buySellSources.length + weightedSources.length);

    tables.forEach(table => {
      expect(table.length).to.equal(4);

      currencies.forEach((currency, index) => {
        expect(table[index + 1][0]).to.equal(currency);
      });

      const title = table.options.head[0].content;
      if (weightedSources.indexOf(title) > -1) {
        expect(table[0]).to.deep.equal(['Currency', 'Weighted']);
      } else {
        expect(table[0]).to.deep.equal(['Currency', 'Buy', 'Sell']);
      }
    });

    done();
  });

  lab.it('formats all sources for some currencies', done => {
    const formatter = new Formatter(rates, ['USD']);
    const tables = formatter.tablesForAllSources();

    tables.forEach(table => {
      expect(table.length).to.equal(2);
      expect(table[1][0]).to.equal('USD');
    });

    done();
  });

  lab.it('formats average rates for all currencies', done => {
    const formatter = new Formatter(rates, currencies);
    const table = formatter.tableForAverageRates();

    expect(table.length).to.equal(3);
    currencies.forEach((currency, index) => {
      expect(table[index][0]).to.equal(currency);
    });
    expect(table.options.head).to.deep
      .equal(['Currency', 'Buy', 'Sell', 'Weighted']);

    done();
  });

  lab.it('formats average rates for some currencies', done => {
    const formatter = new Formatter(rates, ['EUR']);
    const table = formatter.tableForAverageRates();

    expect(table.length).to.equal(1);
    expect(table[0][0]).to.equal('EUR');

    done();
  });
});
