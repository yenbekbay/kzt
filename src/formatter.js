'use strict';

const Table = require('cli-table3');

class Formatter {
  constructor(rates, currencies) {
    this.rates = rates;
    this.currencies = currencies;
  }

  tablesForAllSources() {
    return this.rates.map(source => {
      const colSpan = source.rates
        .map(rate => rate.sell)
        .filter(price => !!price).length > 0 ? 3 : 2;
      const table = new Table({
        head: [{ hAlign: 'center', colSpan: colSpan, content: source.title }]
      });

      table.push(colSpan === 2
        ? ['Currency', 'Weighted']
        : ['Currency', 'Buy', 'Sell']
      );

      source.rates
        .filter(rate => this.currencies.indexOf(rate.currency) > -1)
        .map(this.constructor._rowFromRate)
        .forEach(row => table.push(row));

      return table;
    });
  }

  tableForAverageRates() {
    const flatRates = this.rates
      .map(source => source.rates)
      .reduce((a, b) => a.concat(b));

    const averageRates = this.currencies.map(currency => {
      const currencyRates = flatRates
        .filter(rate => rate.currency === currency);

      return ['buy', 'sell', 'weighted'].reduce((averageRates, key) => {
        averageRates[key] = this.constructor._averageRate(currencyRates, key);
        return averageRates;
      }, { currency: currency });
    });

    const table = new Table({
      head: ['Currency', 'Buy', 'Sell', 'Weighted']
    });
    averageRates
      .map(this.constructor._rowFromRate)
      .forEach(row => table.push(row));

    return table;
  }

  static _rowFromRate(rate) {
    return [
      rate.currency,
      rate.buy,
      rate.sell,
      rate.weighted
    ].filter(column => !!column);
  }

  static _averageRate(rates, key) {
    const totalRates = rates
      .map(rate => rate[key])
      .filter(price => !!price);
    const averageRate = totalRates
      .reduce((a, b) => a + b) / totalRates.length;

    return Math.round(averageRate * 10000) / 10000;
  }
}

module.exports = Formatter;
