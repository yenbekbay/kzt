#! /usr/bin/env node

'use strict';

const Table = require('cli-table2');

const Logger = require('./logger');
const Scraper = require('./scraper');

const argv = require('yargs')
  .option('c', {
    alias: 'currencies',
    describe: 'choose the currencies to display KZT exchange rates for',
    choices: ['USD', 'EUR', 'RUB'],
    default: ['USD', 'EUR', 'RUB'],
    type: 'array'
  })
  .option('a', {
    alias: 'all',
    describe: 'display KZT exchange rates from all sources',
    type: 'boolean'
  })
  .help('h')
  .alias('h', 'help')
  .example('kzt -a -c USD', 'display exchange rates to USD from all sources')
  .example('kzt -c USD EUR', 'display average exchange rates to USD and EUR')
  .argv;
const logger = new Logger();
const scraper = new Scraper(logger);
const currencies = argv.currencies;
const displayAllSources = argv.all;

logger.startSpinner('Getting latest exchange rates');

scraper
  .getRates()
  .subscribe(rates => {
    logger.stopSpinner();
    console.log('Exchange rates for KZT (tenge):');

    if (displayAllSources) {
      rates.forEach(source => {
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
          .filter(rate => currencies.indexOf(rate.currency) > -1)
          .forEach(rate => {
            table.push([rate.currency, rate.buy, rate.sell, rate.weighted]
              .filter(column => !!column)
            );
          });

        console.log(table.toString());
      });
    } else {
      const flatRates = rates
        .map(source => source.rates)
        .reduce((a, b) => a.concat(b));

      const averageRates = currencies.map(currency => {
        const currencyRates = flatRates
          .filter(rate => rate.currency === currency);
        const keys = ['buy', 'sell', 'weighted'];
        let averageRates = { currency: currency };
        keys.forEach(key => {
          const totalRates = currencyRates
            .map(rate => rate[key])
            .filter(price => !!price);
          const averageRate = totalRates
            .reduce((a, b) => a + b) / totalRates.length;
          averageRates[key] = Math.round(averageRate * 10000) / 10000;
        });
        return averageRates;
      });

      const table = new Table({
        head: ['Currency', 'Buy', 'Sell', 'Weighted']
      });
      averageRates.forEach(rate => {
        table.push([rate.currency, rate.buy, rate.sell, rate.weighted]);
      });

      console.log(table.toString());
    }

    process.exit();
  }, err => {
    logger.stopSpinner();
    logger.error('Something went wrong while loading: ' + err.message);

    process.exit(5);
  });
