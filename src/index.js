#! /usr/bin/env node

'use strict';

const Table = require('cli-table2');

const Logger = require('./logger');
const Scraper = require('./scraper');

const argv = require('yargs')
  .option('currencies', {
    alias: 'c',
    describe: 'choose the currencies to display KZT exchange rates for',
    choices: ['USD', 'EUR', 'RUB', 'GBP'],
    default: 'USD'
  })
  .option('all', {
    alias: 'a',
    describe: 'display all KZT exchange rates',
    type: 'boolean'
  })
  .help('help')
  .argv;
const logger = new Logger();
const scraper = new Scraper(logger);
const currencies = argv.all ? ['USD', 'EUR', 'RUB', 'GBP'] : [argv.currencies];

logger.startSpinner('Getting latest exchange rates');

scraper
  .getRates()
  .subscribe(rates => {
    logger.stopSpinner();
    console.log('Exchange rates for KZT (tenge):');

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

      source.rates.forEach(rate => {
        table.push(
          [rate.currency, rate.buy, rate.sell].filter(column => !!column)
        );
      });

      console.log(table.toString());
    });

    process.exit();
  }, err => {
    logger.stopSpinner();
    logger.error('Something went wrong while loading: ' + err.message);

    process.exit(5);
  });
